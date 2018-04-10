import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Message } from '@app/shared/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { RequestsFakeDb } from '../core/fake-db/requests';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class MessagesService extends EntityServiceBase<Message> {
  data: Message[];
  requestsDB: RequestsFakeDb;

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Message', entityServiceFactory);
  }

  build() {
    this.requestsDB = new RequestsFakeDb();
    this.data = this.requestsDB.messages;
  }

  findById(id: string): Observable<Message> {
    if (!this.data || this.data.length === 0) {
      throw new Error('Could not find message');
    }
    return of(this.data.find(x => x.id === id));
  }

  getCount(): Observable<number> {
    if (!this.data) {
      this.build();
    }
    return of(this.data.length);
  }

  getData(): Observable<Message[]> {
    if (!this.data) {
      this.build();
    }
    return of(this.data);
  }
}
