import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Activity, LogEntry } from '@app/shared/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ActivityService extends EntityServiceBase<Activity> {
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Activity', entityServiceFactory);
  }
}

@Injectable()
export class LogEntryService extends EntityServiceBase<LogEntry> {
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('LogEntries', entityServiceFactory);
  }
}
