import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
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
  exportUrl: string;
  onFilterChanged: Subject<any> = new Subject();

  uploading = false;

  constructor(private http: HttpClient) {
    this.editedItems = {};
  }

  export(projectId: string, projectName: string, requestIds: String[]) {
    let params: HttpParams = new HttpParams();
    requestIds.forEach((p: any) => {
      params = params.append('requestId', p);
    });

    return this.http
      .get(environment.serverUrl + '/project/' + projectId + '/recap', {
        responseType: 'blob',
        params: params
      })
      .pipe(
        map((res: any) => {
          const x = res;
          if (res) {
            const filename = projectName + '.xlsx';
            saveAs(x, filename);
          }
          return true;
        })
      );
  }

  openAttachment(uploadFile: UploadFile) {
    return this.http.get(
      environment.serverUrl + '/attachment/' + uploadFile.uid
    );
  }

  deleteAttachment(requestId: string, attachmentId: string) {
    return this.http.delete(
      environment.serverUrl +
        '/request/' +
        requestId +
        '/attachment/' +
        attachmentId
    );
  }

  uploadAttachment(lineItemId: string, fileList: UploadFile[]) {
    //  console.log('file name: ' + JSON.stringify(fileList, null, 2));
    // console.log('item id: ' + lineItemId);
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    fileList.forEach((file: any) => {
      // console.log('file: ' + JSON.stringify(file, null, 2));
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

  grabRequestId(projectId: string, startDate: string, endDate: string) {
    startDate = format(startDate, 'YYYY-MM-DD');
    endDate = format(endDate, 'YYYY-MM-DD');
    return this.http.post(environment.serverUrl + '/request', {
      projectId: projectId,
      startDate: startDate,
      endDate: endDate
    });
  }

  deleteRequest(requestId: string) {
    return this.http.delete(environment.serverUrl + '/request/' + requestId);
  }

  clone(request: any) {
    return this.http.post(
      environment.serverUrl + '/request/' + request.id + '/duplicate',
      {}
    );
  }

  update(requestId: string, updates: any) {
    return this.http
      .put(environment.serverUrl + '/request/' + requestId, updates)
      .pipe(
        map((res: any) => {
          const json = res as any;
          return json;
        })
      );
  }

  submitRequest(requestId: string, eSig: string) {
    return this.http.put(
      environment.serverUrl + '/request/' + requestId + '/submit',
      {
        eSig: eSig
      }
    );
  }

  approve(requestId: string) {
    return this.http.put(
      environment.serverUrl + '/request/' + requestId + '/approve',
      {}
    );
  }
}
