import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Equipment } from '@app/shared/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EquipmentService extends EntityServiceBase<Equipment> {
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Equipment', entityServiceFactory);
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
