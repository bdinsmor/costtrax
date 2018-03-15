import { MessagesService } from './messages.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '@app/core/in-memory-data.service';
import { Observable } from 'rxjs/Observable';
import { MasterDetailCommands } from '@app/core/master-detail-commands';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements MasterDetailCommands<Message>, OnInit {
  selected: Message;
  commands = this;
  messages$: Observable<Message[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  constructor(private messagesService: MessagesService) {
    this.messages$ = messagesService.entities$;
    this.loading$ = messagesService.loading$;
    this.count$ = messagesService.count$;
  }

  ngOnInit() {
    this.getMessages();
  }
  close() {
    this.selected = null;
  }
  enableAddMode() {
    this.selected = <any>{};
  }

  getMessages(): void {
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

  select(m: Message) {
    this.selected = m;
  }

  unselect() {
    this.selected = null;
  }
}
