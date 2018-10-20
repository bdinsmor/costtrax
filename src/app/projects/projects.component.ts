import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../core';
import { appAnimations } from '../core/animations';
import { BreadcrumbService } from '../core/breadcrumbs/breadcrumbs.service';
import { RequestsService } from '../requests/requests.service';
import { Account, Project } from '../shared/model';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: appAnimations
})
export class ProjectsComponent implements OnInit, OnDestroy {
  canSubmitRequests = false;
  canCreateProjects = false;
  private config: MatSnackBarConfig;
  duration = 3000;
  activeProjects$: Observable<Project[]>;
  archivedProjects$: Observable<Project[]>;
  accounts$: Observable<Account[]>;
  loading$: Observable<boolean>;
  projectForm: FormGroup;
  requestableProjects: Project[];

  _projectModalOpen = false;
  _requestModel = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public router: Router,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private authService: AuthenticationService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.breadcrumbService.addHome();
    this.breadcrumbService.addProjects();
    this.createProjectForm();
    this.refreshProjects();
    this.accounts$ = this.projectsService.getAccounts();
    this.projectsService.getProjectsForRequests().subscribe((p: Project[]) => {
      this.requestableProjects = p;
      if (p.length > 0) {
        this.canSubmitRequests = true;
      } else {
        this.canSubmitRequests = false;
      }

      this.changeDetector.detectChanges();
    });
    this.requestsService.getAccounts().subscribe((accounts: Account[]) => {
      if (accounts.length > 0) {
        for (let i = 0; i < accounts.length; i++) {
          const a: Account = accounts[i];
          if (a.roles) {
            for (let j = 0; j < a.roles.length; j++) {
              const role = a.roles[j];
              if (role === 'ProjectManage' || role === 'ProjectAdmin') {
                this.canCreateProjects = true;
                break;
              }
            }
          }
        }
        this.authService.setUserAccounts(accounts);
      } else {
        this.canCreateProjects = false;
      }
      this.changeDetector.detectChanges();
    });
  }

  createProjectForm() {
    this.projectForm = new FormGroup({
      selectedProjectControl: new FormControl('', Validators.required)
    });
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  ngOnDestroy() {}

  refreshProjects() {
    this.archivedProjects$ = this.projectsService.getArchivedProjects();
    this.activeProjects$ = this.projectsService.getActiveProjects();
    this.changeDetector.detectChanges();
  }

  projectSaved(event) {
    this._projectModalOpen = false;
    this.openSnackBar(event.project.name + ' saved!', 'ok', 'OK');
    this.refreshProjects();
  }

  createProject() {
    const selectedProjectId: string = this.projectForm.value
      .selectedProjectControl;
    if (selectedProjectId && selectedProjectId) {
      this.requestsService
        .grabRequestId(selectedProjectId)
        .subscribe((data: any) => {
          if (data && data.id && data.id !== '') {
            this.router.navigate(['./requests', data.id]);
          }
        });
    }
    this._projectModalOpen = true;
  }

  onProjectCancel() {
    this._projectModalOpen = false;
  }

  createRequest() {
    this._requestModel = true;
  }

  cancelRequest() {
    this._requestModel = false;
    this.createProjectForm();
  }

  confirmCreateRequest() {
    const selectedProjectId: string = this.projectForm.value
      .selectedProjectControl;
    if (selectedProjectId && selectedProjectId) {
      this.requestsService
        .grabRequestId(selectedProjectId)
        .subscribe((data: any) => {
          if (data && data.id && data.id !== '') {
            this.router.navigate(['./requests', data.id]);
          }
        });
    }
  }
}
