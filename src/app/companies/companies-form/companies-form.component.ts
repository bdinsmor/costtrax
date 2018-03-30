import { Component, Inject, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Request, Company, Contractor } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { CompaniesService } from '@app/companies/companies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { ContractorsDataService } from '../../contractors/contractor-list/contractors-list.component';

@Component({
  selector: 'app-company-form',
  templateUrl: './companies-form.component.html',
  styleUrls: ['./companies-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanyFormComponent implements OnInit {
  formTitle: string;
  contractorFormGroup: FormGroup;
  action: string;
  contractors$: Observable<Contractor[]>;
  companies$: Observable<Company[]>;
  company: Company;
  employeesDataSource: ContractorsDataSource;
  contractorColumns = ['name', 'jobTitle', 'phone', 'email', 'birthday'];

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private companiesService: CompaniesService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.companiesService.clearCache();
      this.companiesService.getByKey(id);
      this.companiesService.errors$.subscribe(errors => {
        this.openSnackBar(errors.payload.error.message, '');
      });
      this.companiesService.filteredEntities$.subscribe(r => {
        if (r && r.length === 1) {
          this.company = r[0];
          //  console.log('company: ' + JSON.stringify(this.company));
          this.openSnackBar('Loaded Company', '');
          this.createCompanyFormGroup();
          this.employeesDataSource = new ContractorsDataSource(this.company.employees);
          console.log('# employees: ' + this.company.employees.length);
        }
      });
    } else {
      this.company = new Company({});
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  createCompanyFormGroup() {
    return this.formBuilder.group({ projectType: new FormControl('1') });
  }
}

export class ContractorsDataSource extends DataSource<any> {
  constructor(private dataBase: Contractor[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Contractor[]> {
    // console.log('number of employees: ' + JSON.stringify(this.dataBase, null, 2));
    return Observable.of(this.dataBase);
  }

  disconnect() {}
}
