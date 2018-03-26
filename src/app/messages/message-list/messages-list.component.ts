import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { appAnimations } from '@app/core/animations';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

import { MessagesService } from '../messages.service';
import { Request, Project, Message } from '@app/shared/model';
import { SelectionModel } from '@angular/cdk/collections';
import { MessageFormDialogComponent } from '@app/messages/message-form-dialog/message-form.dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class MessagesListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  messages$: Observable<Message[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private router: Router, private messagesService: MessagesService, public dialog: MatDialog) {
    this.messages$ = this.messagesService.entities$;
    this.count$ = this.messagesService.count$;
    this.loading$ = this.messagesService.loading$;
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.messagesService.getAll();
  }

  ngOnDestroy() {}

  openRequest(message: any) {
    this.router.navigate(['../messages', message.id]);
  }
}
