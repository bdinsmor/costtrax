import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { appAnimations } from '@app/core/animations';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

import { ContractorFormComponent } from '../contractor-form/contractor-form.component';
import { ContractorsService } from '../contractors.service';
import { Request, Company, Contractor } from '@app/shared/model';
import { SelectionModel } from '@angular/cdk/collections';
import { CompaniesService } from '@app/contractors/companies.service';

@Component({
  selector: 'app-contractors-list',
  templateUrl: './contractors-list.component.html',
  styleUrls: ['./contractors-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class ContractorsListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: ContractorsDataService | null;
  user: any;
  displayedColumns = ['name', 'openRequests', 'totalPaid'];
  selection = new SelectionModel<Element>(true, []);
  dialogRef: any;
  companies: Observable<Company[]>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private companiesService: CompaniesService,
    private contractorsService: ContractorsService,
    public dialog: MatDialog
  ) {
    this.companies = this.companiesService.entities$;
  }

  ngOnInit() {
    this.dataSource = new ContractorsDataService(this.companiesService);
    this.getData();
  }

  getData() {
    this.companiesService.getAll();
  }

  masterToggle(): void {}
  isAllSelected(): void {}
  ngOnDestroy() {}

  openProject(contractor: any) {}
}

export class ContractorsDataService extends DataSource<any> {
  constructor(private companiesService: CompaniesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    //  console.log('num: ' + this.requestsService.count$);
    return this.companiesService.entities$;
  }
  length(): Observable<number> {
    return this.companiesService.count$;
  }

  disconnect() {}
}
