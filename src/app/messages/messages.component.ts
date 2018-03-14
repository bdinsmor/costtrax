import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { Message } from '@app/core/in-memory-data.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  constructor(private messagesService: MessagesService) {}

  ngOnInit() {
    this.getMessages();
  }

  getMessages(): void {
    this.messagesService.getMessages().subscribe(messages => (this.messages = messages));
  }
}
