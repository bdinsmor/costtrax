import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Request } from '@app/shared/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RequestsService extends EntityServiceBase<Request> {
  foldersArr: any;
  filtersArr: any;
  labelsArr: any;
  requests: Request[];
  onFilterChanged: Subject<any> = new Subject();

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Requests', entityServiceFactory);
  }
}
