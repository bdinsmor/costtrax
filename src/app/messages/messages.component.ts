import { MessagesService } from './messages.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '@app/core/in-memory-data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages$: Observable<Message[]>;
  loading$: Observable<boolean>;
  constructor(private messagesService: MessagesService) {
    this.messages$ = messagesService.entities$;
    this.loading$ = messagesService.loading$;
  }

  ngOnInit() {
    this.getMessages();
  }

  getMessages(): void {
    this.messagesService.getAll();
  }
}
