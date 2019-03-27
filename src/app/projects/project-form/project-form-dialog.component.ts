import { trigger } from '@angular/animations';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatChipInputEvent, MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isObject } from 'util';

import { AuthenticationService } from '../../core/authentication/authentication.service';
import { Account, Project } from '../../shared/model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-project-dialog-form',
  templateUrl: './project-form-dialog.component.html',
  styleUrls: ['./project-form-dialog.component.scss']
})
export class ProjectFormDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<any>,
    public snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private projectsService: ProjectsService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {}
  @ViewChild(MatAutocompleteTrigger) trigger;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  accounts$: Observable<Account[]>;
  projectFormGroup: FormGroup;
  project: Project;
  accountSynced = false;
  firstAccount: Account = new Account({});
  @Output()
  cancel = new EventEmitter();
  @Output()
  save = new EventEmitter();
  private config: MatSnackBarConfig;
  duration = 3000;
  zipPattern = new RegExp(/^\d{5}(?:\d{2})?$/);
  requestingOrgs: string[] = [];
  locations: [] = [];
  states: [] = [];
  filteredStates: Observable<string[]>;
  filteredLocations: Observable<string[]>;
  isLoaded = false;
  activeFormulas = [{ name: 'FHWA', label: 'FHWA' }];
  standbyFormulas = [{ name: '50OWNER', label: '50% Ownership Cost' }];
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  ngOnInit() {
    this.projectsService
      .getRentalStates()
      .pipe(untilDestroyed(this))
      .subscribe((list: any) => {
        this.states = list.results.map((item: any) => {
          item.label = item.stateCode + ' , ' + item.countryCode;
          return item;
        });
      });
    this.projectsService
      .getCostLocations()
      .pipe(untilDestroyed(this))
      .subscribe((list: any) => {
        this.locations = list.results.map((item: any) => {
          let label = '';
          if (item.city && item.city != null && item.city !== '') {
            label = item.city + ' ';
          }
          label = label + item.region;
          item.label = label;
          return item;
        });
      });

    this.authenticationService
      .getCreds()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        if (message) {
          this.accountSynced = message.eqwVerified;
        } else {
          this.accountSynced = false;
        }
        this.accountSynced = true;
        this.changeDetector.detectChanges();
      });
    this.project = new Project({ id: '1' });
    this.project.users = [];
    this.project.requestors = [];
    this.createProjectFormGroup();
    this.accounts$ = this.projectsService.getAccounts();
    this.projectsService.getAccounts().subscribe((accounts: Account[]) => {
      if (!this.authService.credentials.accounts) {
        this.authService.setUserAccounts(accounts);
      }
      if (accounts && accounts.length > 0) {
        this.firstAccount = accounts[0];
      }
      this.createProjectFormGroup();
      this.isLoaded = true;
    });
  }

  onFocus() {
    this.trigger._onChange('');
    this.trigger.openPanel();
  }

  displayFn(val: any) {
    return val ? val.label : val;
  }

  displayLocationFn(val: any) {
    return val ? val.label : val;
  }

  private _filter(value: any): string[] {
    if (isObject(value)) {
      return [];
    }

    const filterValue = value.toLowerCase();
    return this.states.filter((option: any) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  ngOnDestroy(): void {}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.requestingOrgs.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(value): void {
    const index = this.requestingOrgs.indexOf(value);

    if (index >= 0) {
      this.requestingOrgs.splice(index, 1);
    }
  }

  resetForm() {
    this.project = new Project({ id: '1' });
    this.project.users = [];
    this.createProjectFormGroup();
  }

  compareAccounts(a1: Account, a2: Account): boolean {
    return a1.id === a2.id;
  }

  cancelCreate() {
    this.dialogRef.close();
  }

  refreshRequestors(event) {
    this.project.requestors = event.users;
  }

  refreshUsers(event) {
    this.project.users = event.users;
  }

  saveNew() {
    const formData: any = this.projectFormGroup.value;

    const projectData: any = {
      accountId: formData.selectedAccount,
      active: true,
      meta: {
        name: formData.projectName,
        description: formData.projectInstructions,
        paymentTerms: 45,
        requestingOrgs: this.requestingOrgs
      },

      adjustments: {},

      users: this.trimUsers()
    };
    projectData.adjustments.rentalLocation = {
      stateCode: formData.rentalState.stateCode,
      countryCode: formData.rentalState.countryCode,
      zipcode: formData.rentalZipcode
    };
    projectData.adjustments.costLocation = {
      city: formData.location.city,
      cityId: formData.location.cityId,
      region: formData.location.region,
      regionId: formData.location.regionId
    };

    projectData.adjustments.equipmentActive = {
      enabled: formData.activeCheck,
      regionalAdjustmentsEnabled: formData.activeRegionalCheck,
      markup: formData.activeMarkup,
      ownership: formData.activeOwnershipCost,
      operating: formData.activeOperatingCost
    };
    projectData.adjustments.equipmentStandby = {
      enabled: formData.standbyCheck,
      regionalAdjustmentsEnabled: formData.standbyRegionalCheck,
      markup: formData.standbyMarkup
    };

    projectData.adjustments.equipmentRental = {
      enabled: formData.rentalCheck,
      markup: formData.rentalMarkup
    };

    projectData.adjustments.material = {
      enabled: formData.materialCheck,
      markup: formData.materialMarkup
    };
    projectData.adjustments.labor = {
      enabled: formData.laborCheck,
      markup: formData.laborMarkup
    };
    projectData.adjustments.other = {
      enabled: formData.otherCheck,
      markup: formData.otherMarkup
    };
    projectData.adjustments.subcontractor = {
      enabled: formData.subcontractorCheck,
      markup: formData.subcontractorMarkup
    };

    this.projectsService.save(projectData).subscribe(
      (response: any) => {
        this.resetForm();
        this.dialogRef.close({ success: true, project: projectData });
      },
      (error: any) => {
        this.openSnackBar('Project Did Not Save', 'error', 'OK');
      }
    );
  }

  trimUsers() {
    const u = [];
    if (!this.project && !this.project.users) {
      return u;
    }
    for (let i = 0; i < this.project.users.length; i++) {
      u.push({
        email: this.project.users[i].email,
        roles: this.project.users[i].roles
      });
    }
    for (let i = 0; i < this.project.requestors.length; i++) {
      u.push({
        email: this.project.requestors[i].email,
        roles: this.project.requestors[i].roles
      });
    }
    return u;
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  createProjectFormGroup() {
    this.projectFormGroup = new FormGroup({
      projectName: new FormControl(this.project.name, Validators.required),
      rentalState: new FormControl(''),
      rentalZipcode: new FormControl(
        this.project.adjustments.rentalLocation.zipcode,
        Validators.required
      ),
      location: new FormControl(''),
      selectedAccount: new FormControl(
        this.firstAccount.id,
        Validators.required
      ),
      requestingOrgs: new FormControl(this.project.meta.requestingOrgs),
      activeFormula: new FormControl('FHWA'),
      activeMarkup: new FormControl(
        this.project.adjustments.equipmentActive.markup
      ),
      standbyFormula: new FormControl('50OWNER'),
      standbyMarkup: new FormControl(
        this.project.adjustments.equipmentStandby.markup
      ),
      activeRegionalCheck: new FormControl(
        this.project.adjustments.equipmentActive.regionalAdjustmentsEnabled
      ),
      standbyRegionalCheck: new FormControl(
        this.project.adjustments.equipmentStandby.regionalAdjustmentsEnabled
      ),
      rentalMarkup: new FormControl(
        this.project.adjustments.equipmentRental.markup
      ),
      activeOwnershipCost: new FormControl(
        this.project.adjustments.equipmentActive.ownership
      ),
      activeOperatingCost: new FormControl(
        this.project.adjustments.equipmentActive.operating
      ),
      laborMarkup: new FormControl(this.project.adjustments.labor.markup),
      subcontractorMarkup: new FormControl(
        this.project.adjustments.subcontractor.markup
      ),
      materialMarkup: new FormControl(this.project.adjustments.material.markup),
      otherMarkup: new FormControl(this.project.adjustments.other.markup),
      users: new FormControl(this.project.users),
      projectInstructions: new FormControl(this.project.description),
      activeCheck: new FormControl(
        this.project.adjustments.equipmentActive.enabled
      ),
      standbyCheck: new FormControl(
        this.project.adjustments.equipmentStandby.enabled
      ),
      rentalCheck: new FormControl(
        this.project.adjustments.equipmentRental.enabled
      ),
      laborCheck: new FormControl(this.project.adjustments.labor.enabled),
      materialCheck: new FormControl(this.project.adjustments.material.enabled),
      otherCheck: new FormControl(this.project.adjustments.other.enabled),
      subcontractorCheck: new FormControl(
        this.project.adjustments.subcontractor.enabled
      )
    });

    this.filteredStates = this.projectFormGroup
      .get('rentalState')
      .valueChanges.pipe(
        untilDestroyed(this),
        startWith(''),
        map(value => this._filter(value))
      );
  }
}
