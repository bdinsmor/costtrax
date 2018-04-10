import { Component, Inject, ViewEncapsulation, OnInit, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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
  onAdd = new EventEmitter();

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  phonePattern = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
  zipCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
  states: [
    'AL',
    'AK',
    'AS',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FM',
    'FL',
    'GA',
    'GU',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MH',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'MP',
    'OH',
    'OK',
    'OR',
    'PW',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VI',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY'
  ];

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
    this.contractors$ = this.contractorsService.getData();
    this.companies$ = this.companiesService.getData();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contractorsService.findById(id).subscribe(r => {
        if (r) {
          this.contractor = r;
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

  save() {
    this.onAdd.emit(this.contractorFormGroup.value);
  }

  createContractorFormGroup() {
    return this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneOffice: new FormControl(null, [Validators.pattern(this.phonePattern)]),
      phoneMobile: new FormControl(null, [Validators.pattern(this.phonePattern)]),
      fax: new FormControl(''),
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      address1: new FormControl(''),
      address2: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      title: new FormControl(''),
      zipCode: new FormControl('', [Validators.pattern(this.zipCodePattern)]),
      description: new FormControl('')
    });
  }
}
