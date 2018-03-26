import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { appAnimations } from '@app/core/animations';

import { MessageFormComponent } from './message-form/message-form.component';
import { MessagesService } from './messages.service';
import { Request, Costs, Message } from '@app/shared/model';
import { Observable } from 'rxjs/Observable';
import { MessageFormDialogComponent } from './message-form-dialog/message-form.dialog.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class MessagesComponent implements OnInit, OnDestroy {
  searchInput: FormControl;
  dialogRef: any;
  messages$: Observable<Message[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  costs: Observable<Costs>;

  constructor(private messagesService: MessagesService, public dialog: MatDialog) {
    this.searchInput = new FormControl('');
    this.messages$ = messagesService.entities$;
    this.loading$ = messagesService.loading$;
    this.count$ = messagesService.count$;
  }

  newRequest() {
    this.dialogRef = this.dialog.open(MessageFormDialogComponent, {
      panelClass: 'message-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }

      this.messagesService.update(response.getRawValue());
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
        this.messagesService.clearCache();
        this.messagesService.getWithQuery(searchText);
      });
  }

  getData(): void {
    this.messagesService.getAll();

    // console.log('number of messages: ' + JSON.stringify(this.messagesService.count$));
  }
  add(m: Message) {
    this.messagesService.add(m);
  }

  delete(m: Message) {
    this.messagesService.delete(m.id);
  }
  update(m: Message) {
    this.messagesService.update(m);
  }

  ngOnDestroy() {}
}
