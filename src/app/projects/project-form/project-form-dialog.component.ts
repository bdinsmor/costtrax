import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable, Subscription } from 'rxjs';

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
  accounts$: Observable<Account[]>;
  projectFormGroup: FormGroup;
  project: Project;
  subscription: Subscription;
  accountSynced = false;
  firstAccount: Account = new Account({});
  @Output()
  cancel = new EventEmitter();
  @Output()
  save = new EventEmitter();
  private config: MatSnackBarConfig;
  duration = 3000;
  zipPattern = new RegExp(/^\d{5}(?:\d{2})?$/);

  states = [
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' },
    { label: 'Delaware', value: 'DE' },
    { label: 'District of Columbia', value: 'DC' },
    { label: 'Florida', value: 'FL' },
    { label: 'Georgia', value: 'GA' },
    { label: 'Hawaii', value: 'HI' },
    { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' },
    { label: 'Indiana', value: 'IN' },
    { label: 'Iowa', value: 'IA' },
    { label: 'Kansas', value: 'KS' },
    { label: 'Kentucky', value: 'KY' },
    { label: 'Lousiana', value: 'LA' },
    { label: 'Maine', value: 'ME' },
    { label: 'Maryland', value: 'MD' },
    { label: 'Massachusetts', value: 'MA' },
    { label: 'Michigan', value: 'MI' },
    { label: 'Minnesota', value: 'MN' },
    { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' },
    { label: 'Montana', value: 'MT' },
    { label: 'Nebraska', value: 'NE' },
    { label: 'Nevada', value: 'NV' },
    { label: 'New Hampshire', value: 'NH' },
    { label: 'New Jersey', value: 'NJ' },
    { label: 'New Mexico', value: 'NM' },
    { label: 'New York', value: 'NY' },
    { label: 'North Carolina', value: 'NC' },
    { label: 'North Dakota', value: 'ND' },
    { label: 'Ohio', value: 'OH' },
    { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' },
    { label: 'Pennsylvania', value: 'PA' },
    { label: 'Rhode Island', value: 'RI' },
    { label: 'South Carolina', value: 'SC' },
    { label: 'South Dakota', value: 'SD' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Texas', value: 'TX' },
    { label: 'Utah', value: 'UT' },
    { label: 'Vermont', value: 'VT' },
    { label: 'Virginia', value: 'VA' },
    { label: 'Washington', value: 'WA' },
    { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' },
    { label: 'Wyoming', value: 'WY' }
  ];
  isLoaded = false;
  activeFormulas = [{ name: 'FHWA', label: 'FHWA' }];
  standbyFormulas = [{ name: '50OWNER', label: '50% Ownership Cost' }];
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  findState(abbr: string) {
    if (!abbr || abbr === '') {
      return '';
    }

    const st = this.states.find((s: any) => s.value === abbr.toUpperCase());
    if (st) {
      return st.label;
    } else {
      return '';
    }
  }

  ngOnInit() {
    this.subscription = this.authenticationService
      .getCreds()
      .subscribe(message => {
        if (message) {
          this.accountSynced =
            message.advantageId && message.advantageId !== '';
        } else {
          this.accountSynced = false;
        }
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  resetForm() {
    this.project = new Project({ id: '1' });
    this.project.users = [];
    this.createProjectFormGroup();
  }

  toggleCheckbox(type: string, event: any) {
    switch (type) {
      case 'active': {
        this.project.activeCostsEnabled = !this.project.activeCostsEnabled;
        break;
      }
      case 'standby': {
        this.project.standbyCostsEnabled = !this.project.standbyCostsEnabled;
        break;
      }
      case 'rental': {
        this.project.rentalCostsEnabled = !this.project.rentalCostsEnabled;
        break;
      }
      case 'labor': {
        this.project.laborCostsEnabled = !this.project.laborCostsEnabled;
        break;
      }
      case 'material': {
        this.project.materialCostsEnabled = !this.project.materialCostsEnabled;
        break;
      }
      case 'other': {
        this.project.otherCostsEnabled = !this.project.otherCostsEnabled;
        break;
      }
      case 'subcontractor': {
        this.project.subcontractorCostsEnabled = !this.project
          .subcontractorCostsEnabled;
        break;
      }
    }
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
    const project = new Project(formData);
    const projectData: any = {
      accountId: formData.selectedAccount,
      active: project.active,
      name: project.name,
      zipcode: project.zipcode,
      state: project.state,
      description: project.description,
      paymentTerms: project.paymentTerms,
      materialCostsEnabled: project.materialCostsEnabled,
      activeCostsEnabled: project.activeCostsEnabled,
      rentalCostsEnabled: project.rentalCostsEnabled,
      standbyCostsEnabled: project.standbyCostsEnabled,
      laborCostsEnabled: project.laborCostsEnabled,
      otherCostsEnabled: project.otherCostsEnabled,
      subcontractorCostsEnabled: project.subcontractorCostsEnabled,
      adjustments: project.adjustments,

      users: this.trimUsers()
    };
    projectData.adjustments.equipment = {
      active: {
        regionalAdjustmentsEnabled: formData.activeRegionalCheck,
        markup: formData.activeMarkup || 10,
        ownership: formData.activeOwnershipCost || 100,
        operating: formData.activeOperatingCost || 100
      },
      standby: {
        regionalAdjustmentsEnabled: formData.standbyRegionalCheck,
        markup: formData.standbyMarkup || 10
      },
      rental: { markup: formData.rentalMarkup || 10 }
    };
    projectData.adjustments.material.markup = formData.materialMarkup || 10;
    projectData.adjustments.other.markup = formData.otherMarkup || 10;
    projectData.adjustments.subcontractor.markup =
      formData.subcontractorMarkup || 10;
    projectData.adjustments.labor.markup = formData.laborMarkup || 10;
    // console.log('project form: ' + JSON.stringify(projectData, null, 2));

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
      zipcode: new FormControl(this.project.zipcode, Validators.required),
      state: new FormControl(this.project.state, Validators.required),
      selectedAccount: new FormControl(
        this.firstAccount.id,
        Validators.required
      ),
      activeFormula: new FormControl('FHWA'),
      activeMarkup: new FormControl(
        this.project.adjustments.equipment.active.markup
      ),
      standbyFormula: new FormControl('50OWNER'),
      standbyMarkup: new FormControl(
        this.project.adjustments.equipment.standby.markup
      ),
      activeRegionalCheck: new FormControl(
        this.project.adjustments.equipment.active.regionalAdjustmentsEnabled
      ),
      standbyRegionalCheck: new FormControl(
        this.project.adjustments.equipment.standby.regionalAdjustmentsEnabled
      ),
      rentalMarkup: new FormControl(
        this.project.adjustments.equipment.rental.markup
      ),
      activeOwnershipCost: new FormControl(
        this.project.adjustments.equipment.active.ownership
      ),
      activeOperatingCost: new FormControl(
        this.project.adjustments.equipment.active.operating
      ),
      laborMarkup: new FormControl(this.project.adjustments.labor.markup),
      subcontractorMarkup: new FormControl(
        this.project.adjustments.subcontractor.markup
      ),
      materialMarkup: new FormControl(this.project.adjustments.material.markup),
      otherMarkup: new FormControl(this.project.adjustments.other.markup),
      users: new FormControl(this.project.users),
      projectInstructions: new FormControl(this.project.description),
      activeCheck: new FormControl(this.project.activeCostsEnabled),
      standbyCheck: new FormControl(this.project.standbyCostsEnabled),
      rentalCheck: new FormControl(this.project.rentalCostsEnabled),
      laborCheck: new FormControl(this.project.laborCostsEnabled),
      materialCheck: new FormControl(this.project.materialCostsEnabled),
      otherCheck: new FormControl(this.project.otherCostsEnabled),
      subcontractorCheck: new FormControl(
        this.project.subcontractorCostsEnabled
      )
    });
  }
}
