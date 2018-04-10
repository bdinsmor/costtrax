import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Activity, LogEntry } from '@app/shared/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { RequestsFakeDb } from '@app/core/fake-db/requests';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ActivityService extends EntityServiceBase<Activity> {
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Activity', entityServiceFactory);
  }
}

@Injectable()
export class LogEntryService extends EntityServiceBase<LogEntry> {
  data: LogEntry[];
  requestsDB: RequestsFakeDb;
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('LogEntries', entityServiceFactory);
  }

  build() {
    this.requestsDB = new RequestsFakeDb();
    this.data = this.requestsDB.logentries;
  }

  findById(id: string): Observable<LogEntry> {
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

  getData(): Observable<LogEntry[]> {
    if (!this.data) {
      this.build();
    }
    return of(this.data);
  }
}
