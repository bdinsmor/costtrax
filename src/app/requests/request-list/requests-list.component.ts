import { StandbyCost, Contractor } from './../../shared/model';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { appAnimations } from '@app/core/animations';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

import { RequestsService } from '../requests.service';
import { Request, Project, Cost, MaterialCost, Equipment } from '@app/shared/model';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectsService } from '@app/projects/projects.service';
import { RequestFormDialogComponent } from '@app/requests/request-form-dialog/request-form.dialog.component';
import { Router } from '@angular/router';
import { RentalCost, ActiveCost } from '../../shared/model';

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
  rawLineItems$: Observable<any[]>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private router: Router,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.requestsService.getAll();
    this.rawLineItems$ = this.requestsService.entities$;
    this.rawLineItems$.subscribe((res: any[]) => {
      this.requestsService.buildRequests(res);
      this.requests = this.requestsService.requests;
      this.dataSource = new RequestsDataSource(this.requests);
    });
  }

  masterToggle(): void {}
  isAllSelected(): void {}
  ngOnDestroy() {}

  openRequest(request: any) {
    this.router.navigate(['../requests', request.id]);
  }
}

export class RequestsDataSource extends DataSource<any> {
  constructor(private dataBase: Request[]) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Request[]> {
    return Observable.of(this.dataBase);
  }
  length(): Observable<number> {
    return Observable.of(this.dataBase.length);
  }

  disconnect() {}
}
