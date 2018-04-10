import { RequestsFakeDb } from '@app/core/fake-db/requests';
import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Equipment } from '@app/shared/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class EquipmentService extends EntityServiceBase<Equipment> {
  data: Equipment[];
  requestsDB: RequestsFakeDb;

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Equipment', entityServiceFactory);
  }

  build() {
    this.requestsDB = new RequestsFakeDb();
    this.data = this.requestsDB.machines;
  }

  findById(id: string): Observable<Equipment> {
    if (!this.data || this.data.length === 0) {
      throw new Error('Could not find machine');
    }
    return of(this.data.find(x => x.id === id));
  }

  getCount(): Observable<number> {
    if (!this.data) {
      this.build();
    }
    return of(this.data.length);
  }

  getData(): Observable<Equipment[]> {
    if (!this.data) {
      this.build();
    }
    return of(this.data);
  }
}

/*
@Injectable()
export class EquipmentService {
  constructor(private http: HttpClient) {}

  get equipment(): Observable<Equipment[]> {
    return this.http
      .get('https://external.development.equipmentwatchapi.com/v1/taxonomy/models?manufacturer=Caterpillar&limit=50')
      .map((res: any) => {
        console.log('machine: ' + JSON.stringify(res, null, 2));
        let r: Equipment[] = [];
        for (const machine of res) {
          console.log('machine: ' + JSON.stringify(machine, null, 2));
          r.push(new Equipment(machine));
        }
        console.log('r.length: ' + r.length);
        return r;
      });
  }
}
*/
