import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { format } from 'date-fns';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Equipment, Item } from '../shared/model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService implements OnDestroy {
  data: Equipment[];
  private subject = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {}

  sendDateChangeNotification() {
    this.subject.next('date changed');
  }

  getDateNotifications(): Observable<any> {
    return this.subject.asObservable();
  }

  ngOnDestroy(): void {}

  saveRequestorModel(projectId: string, item: Equipment): Observable<any> {
    item.details.year = item.year;
    if (item.id) {
      return this.http.put(
        environment.serverUrl +
          '/project/' +
          projectId +
          '/equipment/' +
          item.id,
        {
          modelId: item.modelId,
          year: item.year,
          configurationSequence:
            item.selectedConfiguration.configurationSequence,
          details: item.details
        }
      );
    } else {
      return this.http.post(
        environment.serverUrl + '/project/' + projectId + '/equipment',
        {
          modelId: item.modelId,
          year: item.year,
          configurationSequence:
            item.selectedConfiguration.configurationSequence,
          details: item.details
        }
      );
    }
  }

  deleteRequestorModel(projectId: string, modelId: string): Observable<any> {
    return this.http.delete(
      environment.serverUrl + '/project/' + projectId + '/equipment/' + modelId
    );
  }

  getModelDetails(modelId: string): Observable<Equipment> {
    return this.http.get(environment.serverUrl + '/equipment/' + modelId).pipe(
      map((res: any) => {
        return new Equipment(res);
      })
    );
  }

  getRequestorModels(projectId: string): Observable<Equipment[]> {
    return this.http
      .get(environment.serverUrl + '/project/' + projectId + '/equipment')
      .pipe(
        map((res: any) => {
          if (!res) {
            return [];
          }
          const r: Equipment[] = [];
          for (const machine of res) {
            const specColumns = {};
            let cols = [];

            const specs = machine.specs;
            machine.selected = false;
            for (let j = 0; j < specs.length; j++) {
              const spec = specs[j];
              const specNameFriendly = spec.specNameFriendly;

              if (!specColumns[specNameFriendly]) {
                specColumns[specNameFriendly] = true;
                cols.push(specNameFriendly);
              }
              machine[specNameFriendly] = spec.specValue || '';
            }

            cols = cols.sort();
            const updatedCols = [];
            for (let k = 0; k < cols.length; k++) {
              const col = cols[k] as string;
              if (!machine[col]) {
                machine[col] = '';
              }
            }
            for (let k = 0; k < cols.length; k++) {
              updatedCols.push({ name: cols[k] });
            }
            machine.columns = updatedCols;
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

        return res as Equipment[];
      })
    );
  }

  getRateDataforSelectedEquipment(
    selectedEquipment: Equipment[],
    state: string = '',
    date: string = '',
    operatingAdjustment: number = 1,
    ownershipAdjustment: number = 1,
    standbyFactor: number = 0.5
  ): Observable<any> {
    const returns = [];
    selectedEquipment.forEach((e: Equipment) => {
      returns.push(
        this.getRateDataForEquipment(
          e,
          state,
          date,
          operatingAdjustment,
          ownershipAdjustment,
          standbyFactor
        )
      );
    });
    return forkJoin(returns);
  }

  recalculateRatesForItems(
    items: Item[],
    state: string = '',
    date: string = '',
    operatingAdjustment: number = 1,
    ownershipAdjustment: number = 1,
    standbyFactor: number = 0.5
  ): Observable<any> {
    const returns = [];

    items.forEach((e: Item) => {
      returns.push(
        this.getRateDataForConfig(
          e.details.selectedConfiguration.modelId,
          e.details.selectedConfiguration.configurationSequence,
          e.details.year,
          state,
          date,
          operatingAdjustment,
          ownershipAdjustment,
          standbyFactor
        )
      );
    });
    return forkJoin(returns);
  }

  getRateDataForEquipment(
    equipment: Equipment,
    state: string = '',
    date: string = '',
    operatingAdjustment: number = 1,
    ownershipAdjustment: number = 1,
    standbyFactor: number = 0.5
  ): Observable<Equipment> {
    let params = new HttpParams();
    params = params.set('date', format(date, 'YYYY-MM-DD'));
    if (
      equipment.year &&
      (equipment.year !== '' || equipment.year !== undefined)
    ) {
      params = params.set('year', String(equipment.year));
    }
    if (state && state !== '') {
      params = params.set('state', state);
    }
    params = params.set('modelId', String(equipment.modelId));
    params = params.set('operatingAdjustment', String(operatingAdjustment));
    params = params.set('ownershipAdjustment', String(ownershipAdjustment));
    params = params.set('standbyFactor', String(standbyFactor));
    params = params.set(
      'configurationSequence',
      String(equipment.configurationSequence)
    );

    const url: string = environment.serverUrl + '/equipment/cost-recovery';

    const options = { params: params };

    return this.http.get(url, options).pipe(
      map((res: any) => {
        if (!equipment.selectedConfiguration) {
          equipment.selectedConfiguration = {
            modelId: equipment.modelId,
            configurationSequence: equipment.configurationSequence,
            rates: res
          };
        } else {
          equipment.selectedConfiguration.rates = res;
        }

        return equipment;
      })
    );
  }

  getRateDataForConfig(
    modelId: string,
    configurationSequence: string,
    year: string = '',
    state: string = '',
    date: string = '',
    operatingAdjustment: number = 1,
    ownershipAdjustment: number = 1,
    standbyFactor: number = 0.5
  ): Observable<any> {
    if (!configurationSequence || configurationSequence === '') {
      return of({});
    }
    let params = new HttpParams();
    if (!date || date === '') {
      date = new Date().toUTCString();
    }
    params = params.set('date', format(date, 'YYYY-MM-DD'));
    if (year && (year !== '' || year !== undefined)) {
      params = params.set('year', String(year));
    }
    if (state && state !== '') {
      params = params.set('state', state);
    }
    params = params.set('modelId', String(modelId));
    params = params.set('operatingAdjustment', String(operatingAdjustment));
    params = params.set('ownershipAdjustment', String(ownershipAdjustment));
    params = params.set('standbyFactor', String(standbyFactor));
    params = params.set('configurationSequence', String(configurationSequence));

    const url: string = environment.serverUrl + '/equipment/cost-recovery';
    const options = { params: params };
    return this.http.get(url, options);
  }

  getConfigurationUsingSubtypeId(
    subtypeId: number,
    state: string = ''
  ): Observable<any> {
    let url: string =
      environment.serverUrl +
      '/equipment/configurations?subtypeId=' +
      subtypeId;

    if (state && state !== '') {
      url += '&state=' + state;
    }

    return this.http.get(url).pipe(
      map((res: any) => {
        if (
          res === 'Query not covered at this time' ||
          res === 'Query not covered by EquipmentWatch at this time'
        ) {
          return { count: 0, results: [] };
        }

        const specColumns = {};
        let cols = [];
        for (let i = 0; i < res.results.length; i++) {
          const specs = res.results[i].specs;
          res.results[i].selected = false;
          for (let j = 0; j < specs.length; j++) {
            const spec = specs[j];
            const specNameFriendly = spec.specNameFriendly;

            if (!specColumns[specNameFriendly]) {
              specColumns[specNameFriendly] = true;
              cols.push(specNameFriendly);
            }
            res.results[i][specNameFriendly] = spec.specValue || '';
          }
        }
        cols = cols.sort();
        const updatedCols = [];
        for (let i = 0; i < res.length; i++) {
          for (let k = 0; k < cols.length; k++) {
            const col = cols[k] as string;
            if (!res.results[i][col]) {
              res.results[i][col] = '';
            }
          }
        }
        for (let k = 0; k < cols.length; k++) {
          updatedCols.push({ name: cols[k] });
        }
        res.columns = updatedCols;
        return res;
      })
    );
  }

  getConfiguration(
    modelId: string,
    year: string = '',
    state: string = '',
    startDate: string = null
  ): Observable<any> {
    const url: string =
      environment.serverUrl + '/equipment/configurations?modelId=' + modelId;
    let params: HttpParams = new HttpParams();
    if (year && year !== '') {
      params = params.set('year', String(year));
    }
    if (state && state !== '') {
      params = params.set('state', state);
    }
    if (startDate && startDate !== '') {
      params = params.set('date', format(startDate, 'YYYY-MM-DD'));
    }

    const options = { params: params };

    return this.http.get(url, options).pipe(
      map((res: any) => {
        if (
          res === 'Query not covered at this time' ||
          res === 'Query not covered by EquipmentWatch at this time'
        ) {
          return { count: 0, results: [] };
        }
        const specColumns = {};
        let cols = [];
        for (let i = 0; i < res.results.length; i++) {
          const specs = res.results[i].specs;
          res.results[i].selected = false;
          for (let j = 0; j < specs.length; j++) {
            const spec = specs[j];
            const specNameFriendly = spec.specNameFriendly;

            if (!specColumns[specNameFriendly]) {
              specColumns[specNameFriendly] = true;
              cols.push(specNameFriendly);
            }
            res.results[i][specNameFriendly] = spec.specValue || '';
          }
        }
        cols = cols.sort();
        const updatedCols = [];
        for (let i = 0; i < res.length; i++) {
          for (let k = 0; k < cols.length; k++) {
            const col = cols[k] as string;
            if (!res.results[i][col]) {
              res.results[i][col] = '';
            }
          }
        }
        for (let k = 0; k < cols.length; k++) {
          updatedCols.push({ name: cols[k] });
        }
        res.columns = updatedCols;
        return res;
      })
    );
  }

  getCategories(): Observable<Equipment[]> {
    const manufacturer = 'Miscellaneous';
    const url: string =
      environment.serverUrl +
      '/equipment/categories?category=*&manufacturer=' +
      manufacturer;
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
    sizeClassId: string = null
  ): Observable<Equipment[]> {
    //  console.log('sizeId: ' + sizeId);
    if (!sizeClassId || sizeClassId === '') {
      return of([]);
    }
    const url: string = environment.serverUrl + '/equipment/models';
    let params: HttpParams = new HttpParams();
    if (term && term.length >= 1) {
      params = params.set('model', term.toLowerCase());
    } else {
      params = params.set('model', '*');
    }
    if (sizeClassId && sizeClassId.length >= 1) {
      params = params.set('sizeClassId', sizeClassId);
    }

    const options = { params: params };

    return this.http.get(url, options).pipe(
      map((res: any) => {
        //  console.log('response: ' + JSON.stringify(res, null, 2));
        if (res === 'Query not covered at this time') {
          return [];
        }
        let r: Equipment[] = res as Equipment[];
        r = this.sortEquipment(r, 'model');
        return r;
      })
    );
  }

  getModels(
    term: string = null,
    manufacturerId: string = null
  ): Observable<Equipment[]> {
    if (
      !manufacturerId ||
      manufacturerId === '' ||
      !term ||
      term.length === 0
    ) {
      return of([]);
    }
    const url: string = environment.serverUrl + '/equipment/models';
    let params: HttpParams = new HttpParams();
    if (term && term.length >= 1) {
      params = params.set('model', term.toLowerCase());
    } else {
      params = params.set('model', '*');
    }
    if (manufacturerId) {
      params = params.set('manufacturerId', manufacturerId);
    }

    const options = { params: params };

    return this.http.get(url, options).pipe(
      map((res: any) => {
        if (res === 'Query not covered at this time') {
          return [];
        }
        let r: Equipment[] = [];
        res.map((re: any) => {
          const e = new Equipment(re);
          r.push(e);
        });
        r = this.sortEquipment(r, 'model');
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
}
