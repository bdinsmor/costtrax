import { StandbyCost, ActiveCost, Cost, Dispute } from './../../shared/model';
import {
  Component,
  Inject,
  ViewEncapsulation,
  OnInit,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Request, Project, Message, MaterialCost, RentalCost } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { RequestsService } from '../requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestFormComponent implements OnInit, AfterViewChecked {
  dialogTitle: string;
  requestForm: FormGroup;
  projectFormGroup: FormGroup;
  costFormGroup: FormGroup;
  costDetailsFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  selectedProject: Project;
  action: string;
  request: Request;
  request$: Observable<Request>;
  projects: Observable<Project[]>;
  requests: Observable<Request[]>;
  disputeTypes: any[] = [{ value: 'hours', viewValue: 'Hours' }, { value: 'transport', viewValue: 'Transport' }];
  issues: any[] = [{ value: 'ch', viewValue: 'Comparatively High' }];
  requestDisputes: any[] = [{ value: 'change', viewValue: 'Change' }];
  materialDisplayedColumns = ['description', 'cost', 'quantity', 'receipt', 'subtotal', 'total'];
  materialDataSource: MaterialDataSource;
  otherDisplayedColumns = ['description', 'cost', 'quantity', 'receipt', 'subtotal', 'total'];
  otherDataSource: MaterialDataSource;
  activeDisplayedColumns = ['description', 'cost', 'quantity', 'receipt', 'subtotal', 'total'];
  activeDataSource: MaterialDataSource;
  today: Date = new Date();
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder
  ) {
    this.projectFormGroup = this.createProjectFormGroup();
    this.costFormGroup = this.createCostFormGroup();
    this.costDetailsFormGroup = this.createCostDetailsFormGroup();
    this.signatureFormGroup = this.createSignatureFormGroup();
    this.projects = this.projectsService.entities$;
    this.requests = this.requestsService.entities$;
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.request = this.requestsService.findById(id);
      if (this.request) {
        this.selectedProject = this.request.project;

        this.createCostFormGroup();
        this.createMaterialCosts();
        // this.openSnackBar('Loaded Request', '');
      } else {
        // this.openSnackBar('Could NOT Load Request with id: ' + id, '');
      }
    } else {
      this.request = new Request({});
    }

    this.projectsService.getAll();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
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

  approveActive(item: ActiveCost) {
    item.approved = true;
  }
  disputeActive(item: ActiveCost) {
    if (!item.disputes) {
      item.disputes = [];
    }
    const d: Dispute[] = [];
    d.push(new Dispute());
    item.disputes = item.disputes.concat(d);
  }

  approveStandby(item: StandbyCost) {
    item.approved = true;
  }
  disputeStandby(item: StandbyCost) {
    if (!item.disputes) {
      item.disputes = [];
    }
    const d: Dispute[] = [];
    d.push(new Dispute());
    item.disputes = item.disputes.concat(d);
  }

  approveRental(item: RentalCost) {
    item.approved = true;
  }
  disputeRental(item: RentalCost) {
    if (!item.disputes) {
      item.disputes = [];
    }
    const d: Dispute[] = [];
    d.push(new Dispute());
    item.disputes = item.disputes.concat(d);
  }

  approveMaterial(item: MaterialCost) {
    item.approved = true;
  }
  disputeMaterial(item: MaterialCost) {
    if (!item.disputes) {
      item.disputes = [];
    }
    const d: Dispute[] = [];
    d.push(new Dispute());
    item.disputes = item.disputes.concat(d);
  }

  approveOther(item: Cost) {
    item.approved = true;
  }
  disputeOther(item: Cost) {
    if (!item.disputes) {
      item.disputes = [];
    }
    const d: Dispute[] = [];
    d.push(new Dispute());
    item.disputes = item.disputes.concat(d);
  }

  approveSubcontractor(item: Cost) {
    item.approved = true;
  }
  disputeSubcontractor(item: Cost) {
    if (!item.disputes) {
      item.disputes = [];
    }
    const d: Dispute[] = [];
    d.push(new Dispute());
    item.disputes = item.disputes.concat(d);
  }

  createMaterialCosts() {
    this.materialDataSource = new MaterialDataSource(this.request.costs.materialCosts.costs);
  }

  createProjectFormGroup() {
    return this.formBuilder.group({ projectType: new FormControl('1'), projectSelect: new FormControl() });
  }
  createCostFormGroup() {
    console.log('createCostForm');
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
