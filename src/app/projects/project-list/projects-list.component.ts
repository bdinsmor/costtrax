import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { appAnimations } from '@app/core/animations';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

import { ProjectFormDialogComponent } from '../project-form/project-form.component';
import { ProjectsService } from '../projects.service';
import { Request, Project } from '@app/shared/model';
import { SelectionModel } from '@angular/cdk/collections';

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
  dataSource: RequestsDataSource | null;
  user: any;
  displayedColumns = ['projectName', 'openRequests', 'contractors'];
  selection = new SelectionModel<Element>(true, []);
  dialogRef: any;
  projects: Observable<Project[]>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private projectsService: ProjectsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new RequestsDataSource(this.projectsService);
  }

  masterToggle(): void {}
  isAllSelected(): void {}
  ngOnDestroy() {}

  openProject(project: any) {
    this.dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      panelClass: 'project-form-dialog',
      data: {
        project: project,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: any) => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];
      switch (actionType) {
        /**
         * Save
         */
        case 'save':
          this.projectsService.update(formData.getRawValue());

          break;
      }
    });
  }
}

export class RequestsDataSource extends DataSource<any> {
  constructor(private projectsService: ProjectsService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    //  console.log('num: ' + this.requestsService.count$);
    return this.projectsService.entities$;
  }
  length(): Observable<number> {
    return this.projectsService.count$;
  }

  disconnect() {}
}
