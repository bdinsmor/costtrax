import { Component, Inject, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Request, Project, Message, MaterialCost } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { RequestsService } from '../requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

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
  action: string;
  request: Request;
  request$: Observable<Request>;
  projects: Observable<Project[]>;
  materialDisplayedColumns = ['description', 'cost', 'quantity', 'receipt', 'subtotal', 'total'];
  materialDataSource: MaterialDataSource;
  otherDisplayedColumns = ['description', 'cost', 'quantity', 'receipt', 'subtotal', 'total'];
  otherDataSource: MaterialDataSource;
  activeDisplayedColumns = ['description', 'cost', 'quantity', 'receipt', 'subtotal', 'total'];
  activeDataSource: MaterialDataSource;
  today: Date = new Date();
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RequestFormWizardComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.costFormGroup = this.createCostFormGroup();
    this.costDetailsFormGroup = this.createCostDetailsFormGroup();
    this.signatureFormGroup = this.createSignatureFormGroup();
    this.projects = this.projectsService.entities$;

    this.action = data.action;

    if (!this.action) {
      this.projectFormGroup = this.createProjectFormGroup('1');
    } else {
      this.projectFormGroup = this.createProjectFormGroup('2');
    }
    console.log('inside dialog');
  }

  ngOnInit() {
    this.projectsService.getAll();
    this.request = new Request({});
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

  createMaterialCosts() {
    console.log('material enabled: ' + this.request.costs.materialCosts.enabled);
    console.log(JSON.stringify(this.request.costs.materialCosts, null, 2));
    console.log('# of material costs: ' + this.request.costs.materialCosts.materialCosts.length);
    this.materialDataSource = new MaterialDataSource(this.request.costs.materialCosts.materialCosts);
  }

  addMaterial() {
    console.log('add material...');
    this.request.costs.materialCosts.materialCosts.push(new MaterialCost({}));
    this.materialDataSource = new MaterialDataSource(this.request.costs.materialCosts.materialCosts);
  }

  save() {
    console.log('material costs: ' + JSON.stringify(this.request.costs.materialCosts, null, 2));
  }

  // If you don't need a filter or a pagination this can be simplified, you just use code from else block
  private refreshMaterialable() {}

  createProjectFormGroup(projectValue: string) {
    return this.formBuilder.group({ projectType: new FormControl(projectValue), projectSelect: new FormControl() });
  }
  createCostFormGroup() {
    console.log('createCostForm');
    if (this.costFormGroup && this.request) {
      console.log('startDate: ' + this.request.startDate);
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
