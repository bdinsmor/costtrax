import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Equipment } from '../shared/model';

@Injectable()
export class EquipmentService {
  data: Equipment[];

  constructor(private http: HttpClient) {}

  saveRequestorModel(projectId: string, item: Equipment): Observable<any> {
    const details = {
      id: item.details.id,
      vin: item.details.vin
    };

    if (item.id) {
      return this.http.put(
        environment.serverUrl + '/project/' + projectId + '/models/' + item.id,
        {
          modelId: item.modelId,
          details: item.details
        }
      );
    } else {
      return this.http.post(
        environment.serverUrl + '/project/' + projectId + '/models',
        {
          modelId: item.modelId,
          details: item.details
        }
      );
    }
  }

  deleteRequestorModel(projectId: string, modelId: string): Observable<any> {
    return this.http.delete(
      environment.serverUrl + '/project/' + projectId + '/models/' + modelId
    );
  }

  getModelDetails(modelId: string): Observable<Equipment> {
    return this.http
      .get(environment.serverUrl + '/equipment/models/' + modelId)
      .pipe(
        map((res: any) => {
          return new Equipment(res);
        })
      );
  }

  getRequestorModels(projectId: string): Observable<Equipment[]> {
    return this.http
      .get(environment.serverUrl + '/project/' + projectId + '/models')
      .pipe(
        map((res: any) => {
          if (!res) {
            return [];
          }
          const r: Equipment[] = [];
          for (const machine of res) {
            const m: Equipment = new Equipment(machine);
            m.status = 'complete';
            r.push(m);
          }

          return r;
        })
      );
  }

  getMakes(term: string = null): Observable<Equipment[]> {
    let url: string = environment.serverUrl + '/equipment/manufacturers';

    if (term && term.length >= 1) {
      url = url + '?manufacturer=' + term;
    } else {
      return of([]);
    }
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res === 'Query not covered at this time') {
          return [];
        }
        const r: Equipment[] = [];
        for (const machine of res) {
          r.push(new Equipment(machine));
        }

        return r;
      })
    );
  }

  getConfiguration(
    modelId: string,
    year: string = '',
    state: string = ''
  ): Observable<any> {
    let url: string =
      environment.serverUrl + '/equipment/configurations?modelId=' + modelId;
    if (year && year !== '') {
      url += '&year=' + year;
    }
    if (state && state !== '') {
      url += '&state=' + state;
    }

    return this.http.get(url).pipe(
      map((res: any) => {
        if (
          res === 'Query not covered at this time' ||
          res === 'Query not covered by EquipmentWatch at this time'
        ) {
          return { columns: [], values: [] };
        }

        const specColumns = {};
        let cols = [];
        for (let i = 0; i < res.length; i++) {
          const specs = res[i].specs;
          res[i].selected = false;
          for (let j = 0; j < specs.length; j++) {
            const spec = specs[j];
            const specNameFriendly = spec.specNameFriendly;

            if (!specColumns[specNameFriendly]) {
              specColumns[specNameFriendly] = true;
              cols.push(specNameFriendly);
            }
            res[i][specNameFriendly] = spec.specValue || '';
          }
        }
        cols = cols.sort();
        const updatedCols = [];
        for (let i = 0; i < res.length; i++) {
          for (let k = 0; k < cols.length; k++) {
            const col = cols[k] as string;
            if (!res[i][col]) {
              res[i][col] = '';
            }
          }
          delete res[i].specs;
        }
        for (let k = 0; k < cols.length; k++) {
          updatedCols.push({ name: cols[k] });
        }
        return { columns: updatedCols, values: res };
      })
    );
  }

  getCategories(): Observable<Equipment[]> {
    const url: string =
      environment.serverUrl + '/equipment/categories?category=*';
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res === 'Query not covered at this time') {
          return [];
        }
        let r: Equipment[] = [];
        for (const machine of res) {
          r.push(new Equipment(machine));
        }
        r = this.sortEquipment(r, 'category');
        // this.getRateData(r);
        return r;
      })
    );
  }

  getSubtypes(categoryId: string = null): Observable<Equipment[]> {
    if (!categoryId || categoryId === '') {
      return of([]);
    }
    const url: string =
      environment.serverUrl +
      '/equipment/subtypes?subtype=*&categoryId=' +
      categoryId;

    return this.http.get(url).pipe(
      map((res: any) => {
        if (res === 'Query not covered at this time') {
          return [];
        }
        let r: Equipment[] = [];
        for (const machine of res) {
          r.push(new Equipment(machine));
        }
        r = this.sortEquipment(r, 'subtype');
        // this.getRateData(r);
        return r;
      })
    );
  }

  getSizes(subtypeId: string = null): Observable<Equipment[]> {
    if (!subtypeId || subtypeId === '') {
      return of([]);
    }
    const url: string =
      environment.serverUrl + '/equipment/sizes?size=*&subtypeId=' + subtypeId;

    return this.http.get(url).pipe(
      map((res: any) => {
        if (res === 'Query not covered at this time') {
          return [];
        }
        let r: Equipment[] = [];
        for (const machine of res) {
          r.push(new Equipment(machine));
        }
        r = this.sortEquipment(r, 'size');
        // this.getRateData(r);
        return r;
      })
    );
  }

  getModelsForSizeId(
    term: string = null,
    sizeId: string = null
  ): Observable<Equipment[]> {
    //  console.log('sizeId: ' + sizeId);
    if (!sizeId || sizeId === '') {
      return of([]);
    }
    let url: string = environment.serverUrl + '/equipment/models';
    let addedParam = false;
    if (term && term.length >= 1) {
      addedParam = true;
      url = url + '?model=' + term.toLowerCase();
    } else {
      return of([]);
    }
    if (sizeId && sizeId !== '') {
      if (addedParam) {
        url = url + '&sizeClassId=' + sizeId;
      } else {
        url = url + '?sizeClassId=' + sizeId;
      }
    }
    return this.http.get(url).pipe(
      map((res: any) => {
        //  console.log('response: ' + JSON.stringify(res, null, 2));
        if (res === 'Query not covered at this time') {
          return [];
        }
        let r: Equipment[] = [];
        for (const machine of res) {
          r.push(new Equipment(machine));
        }
        r = this.sortEquipment(r, 'model');
        // this.getRateData(r);
        return r;
      })
    );
  }

  getModels(
    term: string = null,
    makeId: string = null
  ): Observable<Equipment[]> {
    if (!makeId || makeId === '') {
      return of([]);
    }
    let url: string = environment.serverUrl + '/equipment/models';
    let addedParam = false;
    if (term && term.length >= 1) {
      addedParam = true;
      url = url + '?model=' + term.toLowerCase();
    } else {
      return of([]);
    }
    if (makeId && makeId !== '') {
      if (addedParam) {
        url = url + '&manufacturerId=' + makeId;
      } else {
        url = url + '?manufacturerId=' + makeId;
      }
    }
    // console.log('url:\n' + url);
    return this.http.get(url).pipe(
      map((res: any) => {
        // console.log('response: ' + JSON.stringify(res, null, 2));
        if (res === 'Query not covered at this time') {
          return [];
        }
        let r: Equipment[] = [];
        for (const machine of res) {
          r.push(new Equipment(machine));
        }
        r = this.sortEquipment(r, 'model');
        // this.getRateData(r);
        return r;
      })
    );
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortEquipment(list: Equipment[], field: string, direction: string = 'asc') {
    const sortedList: Equipment[] = list.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (field) {
        case 'category':
          return this.compare(a.categoryName, b.categoryName, isAsc);
        case 'subtype':
          return this.compare(a.subtypeName, b.subtypeName, isAsc);
        case 'size':
          return this.compare(a.sizeClassName, b.sizeClassName, isAsc);
        case 'model':
          return this.compare(a.categoryName, b.categoryName, isAsc);
        case 'id':
          return this.compare(+a.modelId, +b.modelId, isAsc);
      }
    });
    return sortedList;
  }

  /*
"nationalAverages": [
      {
        "dailyRate": 192,
        "weeklyRate": 557,
        "monthlyRate": 1329,
        "revisionDate": "2018-04-01"
      }
    ]

  */

  getRateDataForSizeClassId(
    sizeClassId: string,
    modelId: string,
    state: string = '',
    zipcode: number,
    duration: number = 1
  ): Observable<Equipment> {
    return this.http
      .get(
        environment.serverUrl +
          '/equipment/rates?zipcode=' +
          String(zipcode).trim() +
          '&state=' +
          state +
          '&modelId=' +
          modelId +
          '&sizeClassId=' +
          sizeClassId
      )
      .pipe(
        map((res: any) => {
          if (res === 'Query not covered at this time') {
            return null;
          }
          const e: Equipment = new Equipment(res);
          e.nationalAverages = res.nationalAverages;
          e.rentalHouseRates = res.rentalHouseRates;
          e.sizeClassId = res.sizeClassId;
          e.sizeClassMax = res.sizeClassMax;
          e.sizeClassMin = res.sizeClassMin;
          e.sizeClassUom = res.sizeClassUom;
          e.sizeClassName = res.sizeClassName;
          e.subtypeId = res.subtypeId;
          e.subtypeName = res.subtypeName;
          e.classificationId = res.classificationId;
          e.classificationName = res.classificationName;
          e.categoryName = res.categoryName;
          e.categoryId = res.categoryId;
          e.buildRates(duration);
          return e;
        })
      );
  }

  getConfigurations(choices: Equipment[], state: string = ''): Promise<any> {
    let promises: Promise<any>;

    promises = Promise.all(
      choices.map(async (choice: Equipment) =>
        this.http
          .get(
            environment.serverUrl +
              '/equipment/configurations?modelId=' +
              choice.modelId +
              '&year=' +
              choice.year +
              '&state=' +
              state
          )
          .toPromise()
          .then((res: any) => {
            choice.configurations = res[0].specs;
            console.log(
              'configs:  ' + JSON.stringify(choice.configurations, null, 2)
            );
            return new Promise((resolve, reject) => {
              resolve(choice);
            });
            // return of(choice).toPromise();
          })
      )
    ).then((response: Equipment[]) => {
      return response;
    });

    return promises;
  }

  getRateData(
    state: string = '',
    choices: Equipment[],
    duration: number = 1
  ): Promise<any> {
    let promises: Promise<any>;
    promises = Promise.all(
      choices.map(async (choice: Equipment) =>
        this.http
          .get(
            environment.serverUrl +
              '/equipment/rates?sizeClassId=' +
              choice.sizeClassId +
              '&state=' +
              state
          )
          .toPromise()
          .then((res: any) => {
            choice.nationalAverages = res.nationalAverages;
            choice.regionalAverages = res.regionalAverages;
            choice.sizeClassId = res.sizeClassId;
            choice.sizeClassMax = res.sizeClassMax;
            choice.sizeClassMin = res.sizeClassMin;
            choice.sizeClassUom = res.sizeClassUom;
            choice.sizeClassName = res.sizeClassName;
            choice.subtypeId = res.subtypeId;
            choice.subtypeName = res.subtypeName;
            choice.dateIntroduced = res.dateIntroduced;
            choice.dateDiscontinued = res.dateDiscontinued;
            choice.classificationId = res.classificationId;
            choice.classificationName = res.classificationName;
            choice.categoryName = res.categoryName;
            choice.categoryId = res.categoryId;
            choice.buildRates(duration);
            return new Promise((resolve, reject) => {
              resolve(choice);
            });

            // return of(choice).toPromise();
          })
      )
    ).then((response: Equipment[]) => {
      return of(response);
      // console.log('promise results: ' + JSON.stringify(response, null, 2));
    });

    return promises;

    //  return of([]);
  }
}
