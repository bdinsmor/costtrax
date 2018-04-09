import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Machine } from '@app/shared/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MachinesService extends EntityServiceBase<Machine> {
  onFilterChanged: Subject<any> = new Subject();

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Machines', entityServiceFactory);
  }
}
