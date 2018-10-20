import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import {
  distinctUntilChanged,
  concat,
  map,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { QueryList } from '@angular/core';
import { Observable, of, combineLatest, defer } from 'rxjs';

export class SimpleDataSource<T> extends DataSource<T> {
  constructor(private rows$: Observable<T[]>) {
    super();
  }
  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.rows$;
  }
  disconnect(collectionViewer: CollectionViewer): void {}
}

function defaultCompare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function defaultSort(a: any, b: any): number {
  // treat null === undefined for sorting
  a = a === undefined ? null : a;
  b = b === undefined ? null : b;

  if (a === b) {
    return 0;
  }
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }

  // from this point on a & b can not be null or undefined.

  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}

type SortFn<U> = (a: U, b: U) => number;
interface PropertySortFns<U> {
  [prop: string]: SortFn<U>;
}

/** RxJS operator to map a material Sort object to a sort function */
function toSortFn<U>(
  sortFns: PropertySortFns<U> = {},
  useDefault: boolean = true
): (sort$: Observable<Sort>) => Observable<undefined | SortFn<U>> {
  return sort$ =>
    sort$.pipe(
      map(sort => {
        if (!sort.active || sort.direction === '') {
          return undefined;
        }

        let sortFn = sortFns[sort.active];
        if (!sortFn) {
          if (!useDefault) {
            throw new Error(`Unknown sort property [${sort.active}]`);
          }

          // By default assume sort.active is a property name, and sort using the default sort
          //  uses < and >.
          sortFn = (a: U, b: U) =>
            defaultSort((<any>a)[sort.active], (<any>b)[sort.active]);
        }

        return sort.direction === 'asc' ? sortFn : (a: U, b: U) => sortFn(b, a);
      })
    );
}

export class AppUtils {
  public static filterArrayByString(mainArr: any, searchText: any) {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter((itemObj: any) => {
      return this.searchInObj(itemObj, searchText);
    });
  }

  public static searchInObj(itemObj: any, searchText: String) {
    for (const prop in itemObj) {
      if (!itemObj.hasOwnProperty(prop)) {
        continue;
      }

      const value = itemObj[prop];

      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
  }

  public static searchInArray(arr: Array<any>, searchText: String) {
    for (const value of arr) {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
  }

  public static searchInString(value: String, searchText: any) {
    return value.toLowerCase().includes(searchText);
  }

  public static generateGUID(upperCase?: Boolean) {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return upperCase ? (S4() + S4()).toUpperCase() : S4() + S4();
  }

  public static toggleInArray(item: any, array: Array<any>) {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }

  public static handleize(text: String) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}
