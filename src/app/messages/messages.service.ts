import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Message } from '@app/core/in-memory-data.service';

@Injectable()
export class MessagesService extends EntityServiceBase<Message> {
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Message', entityServiceFactory);
  }
}
