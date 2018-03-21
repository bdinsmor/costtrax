import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { appAnimations } from '@app/core/animations';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

import { RequestFormDialogComponent } from '../request-form/request-form.component';
import { RequestsService } from '../requests.service';
import { Request, Project } from '@app/shared/model';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectsService } from '@app/projects/projects.service';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class RequestsListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  requests: Request[];
  dataSource: RequestsDataSource | null;
  user: any;
  displayedColumns = ['messages', 'id', 'total', 'projectId', 'projectOwner', 'projectName', 'status'];
  selection = new SelectionModel<Element>(true, []);
  dialogRef: any;
  projects: Observable<Project[]>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource = new RequestsDataSource(this.requestsService);
  }

  masterToggle(): void {}
  isAllSelected(): void {}
  ngOnDestroy() {}

  openRequest(request: any) {
    this.dialogRef = this.dialog.open(RequestFormDialogComponent, {
      panelClass: 'request-form-dialog',
      data: {
        request: request,
        projects: this.projects,
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
          this.requestsService.update(formData.getRawValue());

          break;
      }
    });
  }
}

export class RequestsDataSource extends DataSource<any> {
  constructor(private requestsService: RequestsService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    //  console.log('num: ' + this.requestsService.count$);
    return this.requestsService.entities$;
  }
  length(): Observable<number> {
    return this.requestsService.count$;
  }

  disconnect() {}
}
