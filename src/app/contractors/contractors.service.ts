import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Contractor } from '@app/shared/model';
import { Observable } from 'rxjs/Observable';
import { RequestsFakeDb } from '@app/core/fake-db/requests';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ContractorsService extends EntityServiceBase<Contractor> {
  contractors: Contractor[];
  requestsDB: RequestsFakeDb;

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Contractors', entityServiceFactory);
  }

  build() {
    this.requestsDB = new RequestsFakeDb();
    this.contractors = this.requestsDB.contractors;
  }

  findById(id: string): Observable<Contractor> {
    if (!this.contractors || this.contractors.length === 0) {
      throw new Error('Could not find Contractor');
    }
    return of(this.contractors.find(x => x.id === id));
  }

  getData(): Observable<Contractor[]> {
    if (!this.contractors) {
      this.build();
    }
    return of(this.contractors);
  }
}
