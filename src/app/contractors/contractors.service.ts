import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Contractor } from '@app/shared/model';

@Injectable()
export class ContractorsService extends EntityServiceBase<Contractor> {
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Contractors', entityServiceFactory);
  }
}
