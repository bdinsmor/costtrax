import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatChipInputEvent,
  MatDialog,
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../core/authentication/authentication.service';
import { BreadcrumbService } from '../../core/breadcrumbs/breadcrumbs.service';
import { Account, Item, Project, User } from '../../shared/model';
import { ProjectRequestDialogComponent } from '../project-request-dialog.component';
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
  visible = true;
  verticalLayout = 'horizontal';
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private config: MatSnackBarConfig;
  duration = 3000;
  items: any;
  draftCosts = true;
  pendingCosts = true;
  completeCosts = true;
  requestingOrgs: string[] = [];

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
  hasTabs = false;

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
          this.accountSynced = message.eqwVerified;
        } else {
          this.accountSynced = false;
        }
        this.changeDetector.detectChanges();
      });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectsService
        .getProject(id)
        .pipe(untilDestroyed(this))
        .subscribe(r => {
          if (r) {
            this.newProject = false;
            this.project = r;
            this.createProjectFormGroup();
            this.checkPermissions();
            this.breadcrumbService.addProject(r.id, r.meta.name);

            this.titleService.setTitle('Project: ' + r.meta.name);

            this.changeDetector.detectChanges();
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

  calculateCosts() {
    this.project.calculateCosts(
      this.draftCosts,
      this.pendingCosts,
      this.completeCosts
    );
  }

  checkPermissions() {
    this.canSubmitRequests = false;
    this.canManageRequests = false;
    this.canChangeSettings = false;
    if (!this.project.roles) {
      this.hasTabs = false;
      this.changeDetector.detectChanges();
      return;
    }
    for (let i = 0; i < this.project.roles.length; i++) {
      const role = this.project.roles[i];
      if (role === 'ProjectRequestor') {
        this.canSubmitRequests = true;
        this.hasTabs = true;
      }
      if (role === 'ProjectApprover') {
        this.canManageRequests = true;
        this.draftCosts = false;
        this.hasTabs = true;
      }
      if (role === 'ProjectManager') {
        this.canChangeSettings = true;
        this.canManageRequests = true;
        this.draftCosts = false;
        this.isUserAdmin = true;
        this.hasTabs = true;
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
      meta: {
        name: formData.projectName,
        description: formData.projectInstructions,
        paymentTerms: this.project.paymentTerms,
        requestingOrgs: this.requestingOrgs
      }
    };

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
      const dialogRef = this.dialog.open(ProjectRequestDialogComponent, {
        data: { projectId: this.project.id },
        width: '40vw'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          const startDate = result.dateRange[0];
          const endDate = result.dateRange[1];
          this.requestsService
            .grabRequestId(this.project.id, startDate, endDate)
            .subscribe((data: any) => {
              if (data && data.id && data.id !== '') {
                this.router.navigate(['./requests', data.id]);
              }
            });
        }
      });
    }
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  createProjectFormGroup() {
    let city = '';
    try {
      if (this.project.adjustments.costLocation) {
        city = this.project.adjustments.costLocation.city;
        if (city && city !== '') {
          city = city + ' ' + this.project.adjustments.costLocation.region;
        }
      }
      let rentalZipcode = '';
      let rentalState = '';
      if (this.project.adjustments.rentalLocation) {
        if (
          this.project.adjustments.rentalLocation.stateName &&
          this.project.adjustments.rentalLocation.stateName !== '' &&
          this.project.adjustments.rentalLocation.countryCode &&
          this.project.adjustments.rentalLocation.countryCode !== ''
        ) {
          rentalState =
            this.project.adjustments.rentalLocation.stateName +
            ', ' +
            this.project.adjustments.rentalLocation.countryCode;
        } else {
          rentalState = '';
        }

        rentalZipcode = this.project.adjustments.rentalLocation.zipcode;
      }

      this.projectFormGroup = new FormGroup({
        projectName: new FormControl(this.project.name),
        projectCity: new FormControl({ value: city, disabled: true }),
        users: new FormControl(this.project.users),
        requestors: new FormControl(this.project.requestors),
        rentalState: new FormControl({
          value: rentalState,
          disabled: true
        }),
        rentalZipcode: new FormControl({
          value: rentalZipcode,
          disabled: true
        }),
        requestingOrgs: new FormControl(this.project.meta.requestingOrgs),
        projectInstructions: new FormControl(this.project.description),
        activeFormula: new FormControl({
          value: 'FHWA',
          disabled: true
        }),
        activeMarkup: new FormControl({
          value: this.project.adjustments.equipmentActive.markup,
          disabled: true
        }),
        standbyFormula: new FormControl({
          value: '50OWNER',
          disabled: true
        }),
        standbyMarkup: new FormControl({
          value: this.project.adjustments.equipmentStandby.markup,
          disabled: true
        }),
        activeRegionalCheck: new FormControl({
          value: this.project.adjustments.equipmentActive
            .regionalAdjustmentsEnabled,
          disabled: true
        }),
        standbyRegionalCheck: new FormControl({
          value: this.project.adjustments.equipmentStandby
            .regionalAdjustmentsEnabled,
          disabled: true
        }),
        rentalMarkup: new FormControl({
          value: this.project.adjustments.equipmentRental.markup,
          disabled: true
        }),
        activeOwnershipCost: new FormControl({
          value: this.project.adjustments.equipmentActive.ownership,
          disabled: true
        }),
        activeOperatingCost: new FormControl({
          value: this.project.adjustments.equipmentActive.operating,
          disabled: true
        }),
        laborMarkup: new FormControl({
          value: this.project.adjustments.labor.markup,
          disabled: true
        }),
        subcontractorMarkup: new FormControl({
          value: this.project.adjustments.subcontractor.markup,
          disabled: true
        }),
        materialMarkup: new FormControl({
          value: this.project.adjustments.material.markup,
          disabled: true
        }),
        otherMarkup: new FormControl({
          value: this.project.adjustments.other.markup,
          disabled: true
        }),
        activeCheck: new FormControl({
          value: this.project.adjustments.equipmentActive.enabled,
          disabled: true
        }),
        standbyCheck: new FormControl({
          value: this.project.adjustments.equipmentStandby.enabled,
          disabled: true
        }),
        rentalCheck: new FormControl({
          value: this.project.adjustments.equipmentRental.enabled,
          disabled: true
        }),
        laborCheck: new FormControl({
          value: this.project.adjustments.labor.enabled,
          disabled: true
        }),
        materialCheck: new FormControl({
          value: this.project.adjustments.material.enabled,
          disabled: true
        }),
        otherCheck: new FormControl({
          value: this.project.adjustments.other.enabled,
          disabled: true
        }),
        subcontractorCheck: new FormControl({
          value: this.project.adjustments.subcontractor.enabled,
          disabled: true
        })
      });
    } catch (e) {
      console.log('caught error: ' + e);
    }
  }
}
