import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../core';
import { appAnimations } from '../core/animations';
import { BreadcrumbService } from '../core/breadcrumbs/breadcrumbs.service';
import { RequestsService } from '../requests/requests.service';
import { Account, Project } from '../shared/model';
import { ProjectFormDialogComponent } from './project-form/project-form-dialog.component';
import { ProjectRequestDialogComponent } from './project-request-dialog.component';
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

  constructor(
    public titleService: Title,
    public dialog: MatDialog,
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
    this.titleService.setTitle('CostTrax');
    this.accounts$ = this.projectsService.getAccounts();
    this.authService
      .getCreds()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        if (
          message &&
          message.hasOwnProperty('showAddRequest') &&
          message.hasOwnProperty('showAddProject')
        ) {
          this.canSubmitRequests = message.showAddRequest;
          this.canCreateProjects = message.showAddProject;
        } else {
          this.canSubmitRequests = false;
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
    this.openSnackBar(event.project.name + ' saved!', 'ok', 'OK');
    this.refreshProjects();
  }

  createProject() {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.openSnackBar(result.project.name + ' saved!', 'ok', 'OK');
        this.refreshProjects();
      }
    });
  }

  createRequest() {
    const dialogRef = this.dialog.open(ProjectRequestDialogComponent, {
      width: '40vw',
      data: {
        projects: this.requestableProjects
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        if (result.projectId) {
          this.requestsService
            .grabRequestId(result.projectId)
            .subscribe((data: any) => {
              if (data && data.id && data.id !== '') {
                this.router.navigate(['./requests', data.id]);
              }
            });
        }
      }
    });
  }
}
