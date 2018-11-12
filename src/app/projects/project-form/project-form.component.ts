import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../core/authentication/authentication.service';
import { BreadcrumbService } from '../../core/breadcrumbs/breadcrumbs.service';
import { Account, Item, Project, User } from '../../shared/model';
import { ProjectsService } from '../projects.service';
import { RequestsService } from './../../requests/requests.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  private config: MatSnackBarConfig;
  duration = 3000;
  items: any;
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
  _requestModalOpen = false;
  _confirmArchiveModal = false;
  requestId = null;
  newProject = false;
  inOverflow = true;

  @Output()
  save = new EventEmitter();

  constructor(
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private breadcrumbService: BreadcrumbService,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
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
        }
      });
    } else {
      this.newProject = true;
      this.project = new Project({});

      this.createProjectFormGroup();
      this.checkPermissions();
      this.changeDetector.detectChanges();
    }

    this.accounts$ = this.projectsService.getAccounts();
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
      }
      if (role === 'ProjectAdmin') {
        this.canChangeSettings = true;
        this.isUserAdmin = true;
      }
    }
    this.changeDetector.detectChanges();
  }

  toggleCheckbox(type: string, event: any) {
    switch (type) {
      case 'equipment': {
        this.project.equipmentCostsEnabled = !this.project
          .equipmentCostsEnabled;
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

  saveNew() {
    this.save.emit(this.projectFormGroup.value);
  }

  revertChanges() {
    this.createProjectFormGroup();
  }

  saveProject() {
    const formData: any = this.projectFormGroup.value;
    const formProject = new Project(formData);
    const projectData: any = {
      id: this.project.id,
      active: this.project.active,
      accountId: this.project.account.id,
      name: this.project.name,
      zipcode: formProject.zipcode,
      state: formProject.state,
      description: formProject.description,
      paymentTerms: this.project.paymentTerms,
      materialCostsEnabled: formProject.materialCostsEnabled,
      equipmentCostsEnabled: formProject.equipmentCostsEnabled,
      laborCostsEnabled: formProject.laborCostsEnabled,
      otherCostsEnabled: formProject.otherCostsEnabled,
      subcontractorCostsEnabled: formProject.subcontractorCostsEnabled,
      adjustments: formProject.adjustments
    };
    this.projectsService.updateProject(projectData).subscribe(
      (response: any) => {
        this.openSnackBar('Project Saved', 'ok', 'OK');
        this._requestModalOpen = false;
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

  onRequestSubmit(event) {
    if (event) {
      this._requestModalOpen = false;
    }
  }

  onGetRequestId(event) {
    this.requestId = event.requestId;
  }

  onCancel() {
    if (this.requestId !== '') {
      this.requestsService.deleteRequest(this.requestId);
    }
    this._requestModalOpen = false;
  }

  completeProject() {
    this._confirmArchiveModal = true;
  }

  cancelCompleteProject() {
    this._confirmArchiveModal = false;
  }

  confirmCompleteProject() {
    this.projectsService.completeProject(this.project.id).subscribe(
      (response: any) => {
        this._confirmArchiveModal = false;
        this.openSnackBar('Project marked COMPLETE!', 'ok', 'OK');
        this.router.navigate(['../projects']);
      },
      (error: any) => {
        this.openSnackBar('Error Completing Project', 'error', 'OK');
      }
    );
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
      laborSUT: new FormControl(this.project.adjustments.labor.sut),
      laborFUT: new FormControl(this.project.adjustments.labor.fut),
      laborFICA: new FormControl(this.project.adjustments.labor.fica),
      projectInstructions: new FormControl(this.project.description),
      equipmentCostsCheckbox: new FormControl(
        this.project.equipmentCostsEnabled
      ),
      laborCostsCheckbox: new FormControl(this.project.laborCostsEnabled),
      materialCostsCheckbox: new FormControl(this.project.materialCostsEnabled),
      otherCostsCheckbox: new FormControl(this.project.otherCostsEnabled),
      subcontractorCostsCheckbox: new FormControl(
        this.project.subcontractorCostsEnabled
      )
    });
  }
}
