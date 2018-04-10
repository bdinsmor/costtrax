import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { appAnimations } from '@app/core/animations';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectsService } from '../projects.service';
import { Request, Project } from '@app/shared/model';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  requests: Request[];
  dataSource: ProjectsDataSource | null;
  user: any;
  displayedColumns = ['projectName', 'openRequests', 'contractors'];
  selection = new SelectionModel<Element>(true, []);
  dialogRef: any;
  projects: Project[];
  rawProjects$: Observable<Project[]>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private router: Router, private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.getAll();
    this.rawProjects$ = this.projectsService.entities$;
    this.rawProjects$.subscribe((res: any[]) => {
      this.projectsService.buildProjects(res);
      this.projects = this.projectsService.projects;
      this.dataSource = new ProjectsDataSource(this.projects);
    });
  }

  masterToggle(): void {}
  isAllSelected(): void {}
  ngOnDestroy() {}

  openProject(project: Project) {
    this.router.navigate(['../projects', project.id]);
  }
}

export class ProjectsDataSource extends DataSource<any> {
  constructor(private dataBase: Project[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Project[]> {
    return Observable.of(this.dataBase);
  }
  length(): Observable<number> {
    return Observable.of(this.dataBase.length);
  }

  disconnect() {}
}
