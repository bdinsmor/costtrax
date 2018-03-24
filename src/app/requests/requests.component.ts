import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { appAnimations } from '@app/core/animations';

import { RequestFormComponent } from './request-form/request-form.component';
import { RequestsService } from './requests.service';
import { Request, Costs } from '@app/shared/model';
import { Observable } from 'rxjs/Observable';
import { RequestFormDialogComponent } from './request-form-dialog/request-form.dialog.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class RequestsComponent implements OnInit, OnDestroy {
  searchInput: FormControl;
  dialogRef: any;
  requests$: Observable<Request[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  costs: Observable<Costs>;

  constructor(private requestsService: RequestsService, public dialog: MatDialog) {
    this.searchInput = new FormControl('');
    this.requests$ = requestsService.entities$;
    this.loading$ = requestsService.loading$;
    this.count$ = requestsService.count$;
  }

  newRequest() {
    this.dialogRef = this.dialog.open(RequestFormDialogComponent, {
      panelClass: 'request-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }

      this.requestsService.update(response.getRawValue());
    });
  }

  ngOnInit() {
    this.getData();
    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        console.log('searchText: ' + searchText);
        const query = 'project.name=' + searchText;
        this.requestsService.clearCache();
        this.requestsService.getWithQuery(searchText);
      });
  }

  getData(): void {
    this.requestsService.getAll();

    // console.log('number of messages: ' + JSON.stringify(this.messagesService.count$));
  }
  add(m: Request) {
    this.requestsService.add(m);
  }

  delete(m: Request) {
    this.requestsService.delete(m.id);
  }
  update(m: Request) {
    this.requestsService.update(m);
  }

  ngOnDestroy() {}
}
