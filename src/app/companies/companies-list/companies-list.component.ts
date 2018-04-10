import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { appAnimations } from '@app/core/animations';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

import { CompanyFormComponent } from '../companies-form/companies-form.component';
import { Request, Company, Contractor } from '@app/shared/model';
import { SelectionModel } from '@angular/cdk/collections';
import { CompaniesService } from '@app/companies/companies.service';
import { Router } from '@angular/router';
import { ContractorsService } from '@app/contractors/contractors.service';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class CompaniesListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: CompaniesDataSource | null;
  user: any;
  displayedColumns = ['name', 'openRequests', 'totalPaid'];
  selection = new SelectionModel<Element>(true, []);
  dialogRef: any;
  companies$: Observable<Company[]>;
  companies: Company[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private router: Router,
    private companiesService: CompaniesService,
    private contractorsService: ContractorsService,
    public dialog: MatDialog
  ) {
    this.companiesService.build();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    // this.companiesService.getAll();
    this.companiesService.getData().subscribe((res: Company[]) => {
      this.companies = res;
      this.dataSource = new CompaniesDataSource(this.companies);
    });
  }

  masterToggle(): void {}
  isAllSelected(): void {}
  ngOnDestroy() {}

  openCompany(company: any) {
    this.router.navigate(['../companies', company.id]);
  }
}

export class CompaniesDataSource extends DataSource<any> {
  constructor(private dataBase: Company[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Company[]> {
    return Observable.of(this.dataBase);
  }
  length(): Observable<number> {
    return Observable.of(this.dataBase.length);
  }

  disconnect() {}
}
