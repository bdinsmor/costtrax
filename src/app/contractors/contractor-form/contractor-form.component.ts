import { Component, Inject, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Request, Company, Contractor } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { ContractorsService } from '@app/contractors/contractors.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CompaniesService } from '@app/companies/companies.service';

@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.component.html',
  styleUrls: ['./contractor-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContractorFormComponent implements OnInit {
  formTitle: string;
  contractorFormGroup: FormGroup;
  action: string;
  contractor: Contractor;
  contractors$: Observable<Contractor[]>;
  companies$: Observable<Company[]>;

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private contractorsService: ContractorsService,
    private companiesService: CompaniesService,
    private formBuilder: FormBuilder
  ) {
    if (!this.contractor) {
      this.contractor = new Contractor({});
    }
    this.contractorFormGroup = this.createContractorFormGroup();
    this.contractors$ = this.contractorsService.entities$;
    this.companies$ = this.companiesService.entities$;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contractorsService.clearCache();
      this.contractorsService.getByKey(id);
      this.contractorsService.errors$.subscribe(errors => {
        this.openSnackBar(errors.payload.error.message, '');
      });
      this.contractorsService.filteredEntities$.subscribe(r => {
        if (r && r.length === 1) {
          this.contractor = r[0];

          this.openSnackBar('Loaded Contractor', '');
          this.createContractorFormGroup();
        }
      });
    } else {
      this.contractor = new Contractor({});
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  createContractorFormGroup() {
    return this.formBuilder.group({ projectType: new FormControl('1') });
  }
  createCostFormGroup() {
    return this.formBuilder.group({});
  }
  createCostDetailsFormGroup() {
    return this.formBuilder.group({});
  }
  createSignatureFormGroup() {
    return this.formBuilder.group({});
  }
}
