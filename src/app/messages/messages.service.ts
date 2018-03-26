import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Message } from '@app/shared/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessagesService extends EntityServiceBase<Message> {
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Message', entityServiceFactory);
  }
}
