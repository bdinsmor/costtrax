import { Component, Inject, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Request, Company, Contractor } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { ContractorsService } from '@app/contractors/contractors.service';
import { CompaniesService } from '@app/contractors/companies.service';

@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.component.html',
  styleUrls: ['./contractor-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContractorFormComponent {
  formTitle: string;
  contractorFormGroup: FormGroup;
  action: string;
  @Input() contractor: Contractor;
  contractors$: Observable<Contractor[]>;
  companies$: Observable<Company[]>;

  constructor(
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
