import { Component, Inject, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import {
  ActiveCost,
  StandbyCost,
  RentalCost,
  LaborCost,
  Equipment,
  Request,
  Project,
  Message,
  MaterialCost,
  SubcontractorCosts,
  Cost
} from '@app/shared/model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar, MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ProjectsService } from '@app/projects/projects.service';
import { RequestsService } from '../requests.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { EquipmentService } from '@app/requests/equipment.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form-wizard.component.html',
  styleUrls: ['./request-form-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestFormWizardComponent implements OnInit {
  dialogTitle: string;
  requestForm: FormGroup;
  projectFormGroup: FormGroup;
  costFormGroup: FormGroup;
  costDetailsFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  selectedProject: Project;
  machines$: Observable<Equipment[]>;
  machinesFiltered: Equipment[] = [];
  rentalMachinesFiltered: Equipment[] = [];
  action: string;
  request: Request;
  request$: Observable<Request>;
  projects$: Observable<Project[]>;
  projects: Project[] = [];
  materialDisplayedColumns = [
    'materialDescription',
    'materialCost',
    'materialQuantity',
    'materialReceipt',
    'materialSubtotal',
    'materialTotal'
  ];
  materialDataSource: MaterialDataSource;
  otherDisplayedColumns = ['otherType', 'otherDescription', 'otherReceipt', 'otherSubtotal', 'otherTotal'];
  otherDataSource: OtherDataSource;
  subcontractorDisplayedColumns = [
    'subcontractor',
    'subcontractorDescription',
    'subcontractorReceipt',
    'subcontractorSubtotal',
    'subcontractorTotal'
  ];
  subcontractorDataSource: SubcontractorDataSource;
  activeDisplayedColumns = [
    'activeModel',
    'activeYear',
    'activeVin',
    'activeOwnership',
    'activeOperating',
    'activeFHWA',
    'activeHours',
    'activeTransport',
    'activeAmount'
  ];
  activeDataSource: ActiveDataSource;
  standbyDisplayedColumns = [
    'standbyModel',
    'standbyYear',
    'standbyVin',
    'standbyOwnership',
    'standbyOperating',
    'standbyFHWA',
    'standbyHours',
    'standbyTransport',
    'standbyAmount'
  ];
  standbyDataSource: StandbyDataSource;
  rentalDisplayedColumns = [
    'rentalDescription',
    'rentalType',
    'rentalBase',
    'rentalTransportation',
    'rentalOther',
    'rentalReceipt',
    'rentalTotal'
  ];
  rentalDataSource: RentalDataSource;
  today: Date = new Date();
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private equipmentService: EquipmentService,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RequestFormWizardComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.costFormGroup = this.createCostFormGroup();
    this.costDetailsFormGroup = this.createCostDetailsFormGroup();
    this.signatureFormGroup = this.createSignatureFormGroup();
    this.projects$ = this.projectsService.entities$;
    this.projects$.subscribe((res: any[]) => {
      this.projectsService.buildProjects(res);
      this.projects = this.projectsService.projects;
    });
    this.machines$ = this.equipmentService.entities$;

    this.action = data.action;

    if (!this.action) {
      this.projectFormGroup = this.createProjectFormGroup('1');
    } else {
      this.projectFormGroup = this.createProjectFormGroup('2');
    }
  }

  ngOnInit() {
    this.projectsService.getAll();
    this.equipmentService.getAll();
    this.request = new Request({});
    this.createDataSources();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
  }

  customSearchFn(term: string, item: Equipment) {
    term = term.toLocaleLowerCase();
    return (
      item.description.toLocaleLowerCase().indexOf(term) > -1 ||
      item.vin.toLocaleLowerCase() === term ||
      item.model.toLocaleLowerCase() === term ||
      item.make.toLocaleLowerCase() === term
    );
  }

  toggleCheckbox(type: string, event: any) {
    switch (type) {
      case 'equipment': {
        this.request.costs.equipmentCosts.enabled = event.checked;
        break;
      }
      case 'labor': {
        this.request.costs.laborCosts.enabled = event.checked;
        break;
      }
      case 'material': {
        this.request.costs.materialCosts.enabled = event.checked;
        break;
      }
      case 'other': {
        this.request.costs.otherCosts.enabled = event.checked;
        break;
      }
      case 'subcontractor': {
        this.request.costs.subcontractorCosts.enabled = event.checked;
        break;
      }
    }
  }

  get projectType() {
    return this.projectFormGroup.get('projectType');
  }

  createDataSources() {
    this.activeDataSource = new ActiveDataSource(this.request.costs.equipmentCosts.activeCosts.costs);
    this.standbyDataSource = new StandbyDataSource(this.request.costs.equipmentCosts.standbyCosts.costs);
    this.rentalDataSource = new RentalDataSource(this.request.costs.equipmentCosts.rentalCosts.costs);
    this.subcontractorDataSource = new SubcontractorDataSource(this.request.costs.subcontractorCosts.costs);
    this.otherDataSource = new OtherDataSource(this.request.costs.otherCosts.costs);
    this.materialDataSource = new MaterialDataSource(this.request.costs.materialCosts.costs);
  }

  addActive() {
    this.request.costs.equipmentCosts.activeCosts.costs.push(new ActiveCost());
    this.activeDataSource = new ActiveDataSource(this.request.costs.equipmentCosts.activeCosts.costs);
  }

  activeChanged(mc: ActiveCost) {
    mc.total = mc.machine.fhwa * mc.hours;
    this.recalculateTotalEquipment();
  }

  addStandby() {
    this.request.costs.equipmentCosts.standbyCosts.costs.push(new StandbyCost());
    this.standbyDataSource = new StandbyDataSource(this.request.costs.equipmentCosts.standbyCosts.costs);
  }

  standbyChanged(mc: StandbyCost) {
    let total = 0;
    if (mc.hours) {
      total = mc.hours * mc.machine.fhwa;
    }
    if (mc.transportationCost) {
      total += Number(mc.transportationCost);
    }
    mc.total = total;
    this.recalculateTotalEquipment();
  }

  addRental() {
    this.request.costs.equipmentCosts.rentalCosts.costs.push(new RentalCost());
    this.rentalDataSource = new RentalDataSource(this.request.costs.equipmentCosts.rentalCosts.costs);
  }

  rentalChanged(mc: RentalCost) {
    mc.total = mc.machine.baseRental + mc.transportationCost + mc.other;
    this.recalculateTotalEquipment();
  }

  addLabor() {}

  addOther() {
    this.request.costs.otherCosts.costs.push(new Cost());
    this.otherDataSource = new OtherDataSource(this.request.costs.otherCosts.costs);
  }

  otherChanged(mc: MaterialCost) {
    mc.subtotal = mc.costPerUnit * mc.unitQuantity;
    mc.total = mc.subtotal * 1.05;
    this.recalculateTotalOther();
  }

  addSubcontractor() {
    this.request.costs.subcontractorCosts.costs.push(new Cost());
    this.subcontractorDataSource = new SubcontractorDataSource(this.request.costs.subcontractorCosts.costs);
  }

  subcontractorChanged(mc: Cost) {
    mc.total = mc.subtotal * 1.05;
    this.recalculateTotalSubcontractor();
  }

  addMaterial() {
    this.request.costs.materialCosts.costs.push(new MaterialCost({}));
    this.materialDataSource = new MaterialDataSource(this.request.costs.materialCosts.costs);
  }

  materialChanged(mc: MaterialCost) {
    mc.subtotal = mc.costPerUnit * mc.unitQuantity;
    mc.total = mc.subtotal * 1.05;
    this.recalculateTotalMaterial();
  }

  recalculateTotalMaterial() {
    let total = 0;
    for (let i = 0; i < this.request.costs.materialCosts.costs.length; i++) {
      const c: MaterialCost = this.request.costs.materialCosts.costs[i];
      total += c.total;
    }
    this.request.costs.materialCosts.total = total;
    this.recalculateTotal();
  }

  recalculateTotalEquipment() {
    let total = 0;
    let activeTotal = 0;
    let standbyTotal = 0;
    let rentalTotal = 0;
    for (let i = 0; i < this.request.costs.equipmentCosts.activeCosts.costs.length; i++) {
      const c: ActiveCost = this.request.costs.equipmentCosts.activeCosts.costs[i];
      activeTotal += c.total;
    }
    for (let i = 0; i < this.request.costs.equipmentCosts.standbyCosts.costs.length; i++) {
      const c: StandbyCost = this.request.costs.equipmentCosts.standbyCosts.costs[i];
      standbyTotal += c.total;
    }
    for (let i = 0; i < this.request.costs.equipmentCosts.rentalCosts.costs.length; i++) {
      const c: RentalCost = this.request.costs.equipmentCosts.rentalCosts.costs[i];
      rentalTotal += c.total;
    }
    this.request.costs.equipmentCosts.activeCosts.total = activeTotal;
    this.request.costs.equipmentCosts.standbyCosts.total = standbyTotal;
    this.request.costs.equipmentCosts.rentalCosts.total = rentalTotal;
    total = activeTotal + standbyTotal + rentalTotal;
    this.request.costs.equipmentCosts.total = total;
    this.recalculateTotal();
  }

  recalculateTotalLabor() {
    const total = 0;
    this.request.costs.laborCosts.total = total;
    this.recalculateTotal();
  }

  recalculateTotalSubcontractor() {
    let total = 0;
    for (let i = 0; i < this.request.costs.subcontractorCosts.costs.length; i++) {
      const c: Cost = this.request.costs.subcontractorCosts.costs[i];
      total += c.total;
    }
    this.request.costs.subcontractorCosts.total = total;
    this.recalculateTotal();
  }

  recalculateTotalOther() {
    let total = 0;
    for (let i = 0; i < this.request.costs.otherCosts.costs.length; i++) {
      const c: Cost = this.request.costs.otherCosts.costs[i];
      total += c.total;
    }
    this.request.costs.otherCosts.total = total;
    this.recalculateTotal();
  }

  recalculateTotal() {
    let total = 0;
    if (this.request.costs.equipmentCosts) {
      total += this.request.costs.equipmentCosts.total;
    }
    if (this.request.costs.laborCosts) {
      total += this.request.costs.laborCosts.total;
    }
    if (this.request.costs.materialCosts) {
      total += this.request.costs.materialCosts.total;
    }
    if (this.request.costs.otherCosts) {
      total += this.request.costs.otherCosts.total;
    }
    if (this.request.costs.subcontractorCosts) {
      total += this.request.costs.subcontractorCosts.total;
    }
    this.request.costs.total = total;
  }

  save() {
    console.log('request json: ' + JSON.stringify(this.request, null, 2));
  }

  createProjectFormGroup(projectValue: string) {
    return this.formBuilder.group({ projectType: new FormControl(projectValue), projectSelect: new FormControl() });
  }
  createCostFormGroup() {
    if (this.costFormGroup && this.request) {
      this.costFormGroup.controls['startDate'].patchValue(this.request.startDate);
      this.costFormGroup.controls['endDate'].patchValue(this.request.endDate);
    } else {
      return this.formBuilder.group({
        startDate: new FormControl(new Date()),
        endDate: new FormControl(new Date()),
        equipmentCostsCheckbox: new FormControl(false),
        laborCostsCheckbox: new FormControl(false),
        materialCostsCheckbox: new FormControl(false),
        otherCostsCheckbox: new FormControl(false),
        subcontractorCostsCheckbox: new FormControl(false)
      });
    }
  }
  createCostDetailsFormGroup() {
    return this.formBuilder.group({});
  }
  createSignatureFormGroup() {
    return this.formBuilder.group({});
  }
}

export class ActiveDataSource extends DataSource<any> {
  constructor(private dataBase: ActiveCost[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ActiveCost[]> {
    console.log('number of active costs: ' + this.dataBase.length);
    return Observable.of(this.dataBase);
  }

  disconnect() {}
}

export class StandbyDataSource extends DataSource<any> {
  constructor(private dataBase: StandbyCost[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<StandbyCost[]> {
    console.log('number of standby costs: ' + this.dataBase.length);
    return Observable.of(this.dataBase);
  }

  disconnect() {}
}

export class RentalDataSource extends DataSource<any> {
  constructor(private dataBase: RentalCost[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<RentalCost[]> {
    console.log('number of rental costs: ' + this.dataBase.length);
    return Observable.of(this.dataBase);
  }

  disconnect() {}
}

export class LaborDataSource extends DataSource<any> {
  constructor(private dataBase: LaborCost[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<LaborCost[]> {
    console.log('number of labor costs: ' + this.dataBase.length);
    return Observable.of(this.dataBase);
  }

  disconnect() {}
}

export class OtherDataSource extends DataSource<any> {
  constructor(private dataBase: Cost[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Cost[]> {
    console.log('number of other costs: ' + this.dataBase.length);
    return Observable.of(this.dataBase);
  }

  disconnect() {}
}

export class SubcontractorDataSource extends DataSource<any> {
  constructor(private dataBase: Cost[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Cost[]> {
    console.log('number of subcontractor costs: ' + this.dataBase.length);
    return Observable.of(this.dataBase);
  }

  disconnect() {}
}

export class MaterialDataSource extends DataSource<any> {
  constructor(private dataBase: MaterialCost[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<MaterialCost[]> {
    console.log('number of material costs: ' + this.dataBase.length);
    return Observable.of(this.dataBase);
  }

  disconnect() {}
}

/*
export class MaterialDataSource extends DataSource<any> {
  constructor(private dataBase: MaterialCost[], private paginator: MatPaginator) {
    super();
  }
  connect(): Observable<MaterialCost[]> {
    // return Observable.of(this.dataBase);
    const displayDataChanges = [
      // Observable.of(this.dataBase),
      this.dataBase,
      this.paginator.page
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.dataBase.slice();
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const finalData = data.splice(startIndex, this.paginator.pageSize);

      // console.log(finalData, 'finalData')
      return finalData;
    });
  }

  disconnect() {}
} */
