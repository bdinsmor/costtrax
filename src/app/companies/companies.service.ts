import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Company } from '@app/shared/model';

@Injectable()
export class CompaniesService extends EntityServiceBase<Company> {
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Companies', entityServiceFactory);
  }
}
