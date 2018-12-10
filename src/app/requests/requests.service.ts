import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Account, Item, Project, Request } from '../shared/model';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  foldersArr: any;
  filtersArr: any;
  labelsArr: any;
  requests: Request[];
  editedItems: Object;
  onFilterChanged: Subject<any> = new Subject();

  uploading = false;

  constructor(private http: HttpClient) {
    this.editedItems = {};
  }

  openAttachment(uploadFile: UploadFile) {
    return this.http.get(
      environment.serverUrl + '/attachment/' + uploadFile.uid
    );
  }

  uploadAttachment(lineItemId: string, fileList: UploadFile[]) {
    console.log('file name: ' + JSON.stringify(fileList, null, 2));
    console.log('item id: ' + lineItemId);
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    fileList.forEach((file: any) => {
      console.log('file: ' + JSON.stringify(file, null, 2));
    });
    return this.http.post(
      environment.serverUrl + '/lineitem/' + lineItemId + '/attachment',
      formData
    );
  }

  addEditItem(item: Item) {
    const i: Item = new Item(JSON.parse(JSON.stringify(item)));
    this.editedItems[item.id] = i;
  }

  revertItem(itemId: string): Item {
    return this.editedItems[itemId];
  }

  getRequest(id: string): Observable<Request> {
    return this.http.get(environment.serverUrl + '/request/' + id).pipe(
      map((res: any) => {
        const json = res as any;
        return new Request(json);
      })
    );
  }

  getRequestTotals(id: string): Observable<any> {
    return this.http.get(environment.serverUrl + '/request/' + id).pipe(
      map((res: any) => {
        const json = res as any;
        const r: Request = new Request(json);
        return r.getTotals();
      })
    );
  }

  getProjects(): Observable<Project[]> {
    return this.http.get(environment.serverUrl + '/project').pipe(
      map((res: any) => {
        const projects: Project[] = [];
        res.forEach((p: any) => {
          const start = new Date().getTime();
          projects.push(new Project(p));
          const end = new Date().getTime();
        });
        return projects;
      })
    );
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get(environment.serverUrl + '/account/' + id).pipe(
      map((res: any) => {
        const json = res as any;
        return json as Account;
      })
    );
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get(environment.serverUrl + '/account').pipe(
      map((res: any) => {
        const accounts: Account[] = [];
        res.forEach((a: any) => {
          accounts.push(new Account(a));
        });
        return accounts;
      })
    );
  }

  getDaysBreakdown(days: number) {
    return this.http.get(
      environment.serverUrl + '/equipment/rental-breakdown/' + days
    );
  }

  grabRequestId(projectId: string) {
    return this.http.post(environment.serverUrl + '/request', {
      projectId: projectId
    });
  }

  deleteRequest(requestId: string) {
    return this.http.delete(environment.serverUrl + '/request/' + requestId);
  }

  clone(request: any) {
    return this.http.put(
      environment.serverUrl + '/request/' + request.id + '/duplicate',
      {}
    );
  }

  update(request: any) {
    const updates = {
      notes: request.notes,
      start: request.startDate,
      end: request.endDate
    };

    return this.http
      .put(environment.serverUrl + '/request/' + request.id, updates)
      .pipe(
        map((res: any) => {
          const json = res as any;
          return json;
        })
      );
  }

  patchLineItems(lineItems: any) {
    let promises: Promise<any>;
    promises = Promise.all(
      lineItems.map(async (lineItem: any) =>
        this.http
          .patch(environment.serverUrl + '/lineitem/' + lineItem.id, lineItem)
          .toPromise()
      )
    );
    return promises;
  }

  saveLineItems(lineItems: any) {
    let promises: Promise<any>;
    promises = Promise.all(
      lineItems.map(async (lineItem: any) =>
        this.http
          .post(environment.serverUrl + '/lineitem', lineItem)
          .toPromise()
      )
    );
    return promises;
  }

  submitRequest(requestId: string, requestNotes: string, eSig: string) {
    return this.http.put(
      environment.serverUrl + '/request/' + requestId + '/submit',
      {
        // notes: requestNotes,
        eSig: eSig
      }
    );
  }

  getLineItem(id: string) {
    return this.http.get(environment.serverUrl + '/lineitem/' + id);
  }

  deleteLineItem(lineItemId: string) {
    return this.http.delete(environment.serverUrl + '/lineitem/' + lineItemId);
  }

  updateLineItem(item: Item) {
    return this.http.patch(
      environment.serverUrl + '/lineitem/' + item.id,
      item
    );
  }

  approve(requestId: string) {
    return this.http.put(
      environment.serverUrl + '/request/' + requestId + '/approve',
      {}
    );
  }

  approveLineItemAsIs(lineItem: Item) {
    return this.http.put(
      environment.serverUrl + '/lineitem/' + lineItem.id + '/approve-as-is',
      {}
    );
  }

  approveLineItemsAsIs(lineItems: Item[]) {
    let promises: Promise<any>;
    promises = Promise.all(
      lineItems.map(async (lineItem: any) =>
        this.http
          .put(
            environment.serverUrl +
              '/lineitem/' +
              lineItem.id +
              '/approve-as-is',
            {}
          )
          .toPromise()
      )
    );
    return promises;
  }

  approveLineItemWithChanges(lineItem: Item) {
    const data = {
      amountApproved: lineItem.finalAmount,
      changeReason: lineItem.changeReason
    };
    return this.http.put(
      environment.serverUrl +
        '/lineitem/' +
        lineItem.id +
        '/approve-with-change',
      data
    );
  }
}
