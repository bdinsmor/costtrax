import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../core/authentication/authentication.service';
import { BreadcrumbService } from '../../core/breadcrumbs/breadcrumbs.service';
import { Account, Item, Project, User } from '../../shared/model';
import { ProjectsService } from '../projects.service';
import { RequestsService } from './../../requests/requests.service';
import { ProjectCompleteDialogComponent } from './../project-complete-dialog.component';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private breadcrumbService: BreadcrumbService,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private titleService: Title
  ) {}
  private config: MatSnackBarConfig;
  duration = 3000;
  items: any;
  draftCosts = true;
  pendingCosts = true;
  completeCosts = true;

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
  activeFormulas = [{ name: 'FHWA', label: 'FHWA' }];
  standbyFormulas = [{ name: '50OWNER', label: '50% Ownership Cost' }];
  projectFormGroup: FormGroup;
  action: string;
  project: Project;
  isUserAdmin = false;
  canChangeSettings = false;
  selectedItems: string[] = [];
  filteredItems: Observable<any[]>;
  invitedContractors = new FormControl();
  addItems: FormControl;
  users: User[];
  accounts$: Observable<Account[]>;
  canSubmitRequests = false;
  canManageRequests = false;
  requestId = null;
  newProject = false;
  inOverflow = true;
  accountSynced = false;

  @Output() save = new EventEmitter();
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  ngOnDestroy() {}

  ngOnInit() {
    this.authenticationService
      .getCreds()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        if (message) {
          this.accountSynced =
            message.advantageId && message.advantageId !== '';
        } else {
          this.accountSynced = false;
        }
        this.changeDetector.detectChanges();
      });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectsService.getProject(id).subscribe(r => {
        if (r) {
          this.newProject = false;
          this.project = r;
          this.createProjectFormGroup();
          this.checkPermissions();
          this.breadcrumbService.addProject(r.id, r.name);
          this.changeDetector.detectChanges();
          this.titleService.setTitle('Project: ' + r.name);
        }
      });
    } else {
      this.newProject = true;
      this.project = new Project({});
      this.titleService.setTitle('New Project');
      this.createProjectFormGroup();
      this.checkPermissions();
      this.changeDetector.detectChanges();
    }

    this.accounts$ = this.projectsService.getAccounts();
  }

  calculateCosts() {
    this.project.calculateCosts(
      this.draftCosts,
      this.pendingCosts,
      this.completeCosts
    );
  }

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

  checkPermissions() {
    this.canSubmitRequests = false;
    this.canManageRequests = false;
    this.canChangeSettings = false;
    if (!this.project.roles) {
      return;
    }
    for (let i = 0; i < this.project.roles.length; i++) {
      const role = this.project.roles[i];
      if (role === 'RequestSubmit') {
        this.canSubmitRequests = true;
      }
      if (role === 'RequestManage') {
        this.canManageRequests = true;
        this.draftCosts = false;
      }
      if (role === 'ProjectAdmin') {
        this.canChangeSettings = true;
        this.draftCosts = false;
        this.isUserAdmin = true;
      }
    }
    this.changeDetector.detectChanges();
  }

  saveNew() {
    this.save.emit(this.projectFormGroup.value);
  }

  revertChanges() {
    this.createProjectFormGroup();
  }

  saveProject() {
    const formData: any = this.projectFormGroup.value;
    const projectData: any = {
      id: this.project.id,
      active: this.project.active,
      accountId: this.project.account.id,
      name: this.project.name,
      zipcode: formData.zipcode,
      state: formData.state,
      description: formData.projectInstructions,
      paymentTerms: this.project.paymentTerms,
      adjustments: {}
    };

    projectData.adjustments.equipment = {
      active: {
        enabled: formData.activeCheck,
        regionalAdjustmentsEnabled: formData.activeRegionalCheck,
        markup: formData.activeMarkup,
        ownership: formData.activeOwnershipCost,
        operating: formData.activeOperatingCost
      },
      standby: {
        enabled: formData.standbyCheck,
        regionalAdjustmentsEnabled: formData.standbyRegionalCheck,
        markup: formData.standbyMarkup
      },

      rental: {
        enabled: formData.rentalCheck,
        markup: formData.rentalMarkup
      }
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

    /*
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
      otherMarkup: new FormControl(this.project.adjustments.other.markup), */

    this.projectsService.updateProject(projectData).subscribe(
      (response: any) => {
        this.openSnackBar('Project Saved', 'ok', 'OK');
      },
      (error: any) => {
        this.openSnackBar('Error Saving Project', 'error', 'OK');
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
    return u;
  }

  refreshUsers() {
    this.reloadProject();
  }

  refreshItems(updatedItem: Item) {
    this.reloadProject();
  }

  reloadProject() {
    this.projectsService.getProject(this.project.id).subscribe((data: any) => {
      this.project = data;
      this.project.users = data.users;
      this.project.requestors = data.requestors;
      this.changeDetector.markForCheck();
    });
  }

  onGetRequestId(event) {
    this.requestId = event.requestId;
  }

  completeProject() {
    const dialogRef = this.dialog.open(ProjectCompleteDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.projectsService.completeProject(this.project.id).subscribe(
          (response: any) => {
            this.openSnackBar('Project marked COMPLETE!', 'ok', 'OK');
            this.router.navigate(['../projects']);
          },
          (error: any) => {
            this.openSnackBar('Error Completing Project', 'error', 'OK');
          }
        );
      }
    });
  }

  createRequest() {
    if (this.project && this.project.id) {
      this.requestsService
        .grabRequestId(this.project.id)
        .subscribe((data: any) => {
          if (data && data.id && data.id !== '') {
            this.router.navigate(['./requests', data.id]);
          }
        });
    }
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  createProjectFormGroup() {
    this.projectFormGroup = new FormGroup({
      projectName: new FormControl(this.project.name),
      users: new FormControl(this.project.users),
      requestors: new FormControl(this.project.requestors),
      zipcode: new FormControl(this.project.zipcode),
      state: new FormControl(this.project.state),
      projectInstructions: new FormControl(this.project.description),
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
      activeCheck: new FormControl(
        this.project.adjustments.equipment.active.enabled
      ),
      standbyCheck: new FormControl(
        this.project.adjustments.equipment.standby.enabled
      ),
      rentalCheck: new FormControl(
        this.project.adjustments.equipment.rental.enabled
      ),
      laborCheck: new FormControl(this.project.adjustments.labor.enabled),
      materialCheck: new FormControl(this.project.adjustments.material.enabled),
      otherCheck: new FormControl(this.project.adjustments.other.enabled),
      subcontractorCheck: new FormControl(
        this.project.adjustments.subcontractor.enabled
      )
    });
  }
}
