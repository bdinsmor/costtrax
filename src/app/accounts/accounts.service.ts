import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Account } from '../shared/model';

@Injectable()
export class AccountService {
  constructor(private http: HttpClient) {}

  create(account: Account): Observable<any> {
    return this.http.post(environment.serverUrl + '/account', account);
  }

  delete(accountId: string) {
    return this.http.delete(environment.serverUrl + '/account/' + accountId);
  }

  update(account: Account) {
    return this.http.put(
      environment.serverUrl + '/account/' + account.id,
      account
    );
  }

  getActiveAccounts(): Observable<Account[]> {
    return this.http.get(environment.serverUrl + '/account?active=1').pipe(
      map((res: any) => {
        const accounts: Account[] = [];
        res.forEach((p: any) => {
          //   console.log('project name: ' + p.name);
          accounts.push(new Account(p));
        });
        return accounts;
      })
    );
  }

  getArchivedAccountss(): Observable<Account[]> {
    return this.http.get(environment.serverUrl + '/account?active=0').pipe(
      map((res: any) => {
        const accounts: Account[] = [];
        res.forEach((p: any) => {
          //   console.log('project name: ' + p.name);
          accounts.push(new Account(p));
        });
        return accounts;
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
}
