import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Company } from '@app/shared/model';
import { RequestsFakeDb } from '@app/core/fake-db/requests';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class CompaniesService extends EntityServiceBase<Company> {
  companies: Company[];
  requestsDB: RequestsFakeDb;

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Companies', entityServiceFactory);
  }

  build() {
    this.requestsDB = new RequestsFakeDb();
    this.companies = this.requestsDB.companies;
  }

  findById(id: string): Observable<Company> {
    if (!this.companies || this.companies.length === 0) {
      throw new Error('Could not find company');
    }
    return of(this.companies.find(x => x.id === id));
  }

  getData(): Observable<Company[]> {
    if (!this.companies) {
      this.build();
    }
    return of(this.companies);
  }
}
