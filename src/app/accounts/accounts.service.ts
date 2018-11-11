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
    const pb = {
      organization: account.accountName,
      users: [{ email: account.email }]
    };
    return this.http.post(environment.serverUrl + '/account', pb);
  }

  archive(accountId: string) {
    return this.http.put(environment.serverUrl + '/account/' + accountId, {
      active: false
    });
  }

  delete(accountId: string) {
    return this.http.delete(environment.serverUrl + '/account/' + accountId);
  }

  update(account: Account) {
    return this.http.put(environment.serverUrl + '/account/' + account.id, {
      accountName: account.accountName,
      email: account.email
    });
  }

  getActiveAccounts(): Observable<Account[]> {
    return this.http
      .get(environment.serverUrl + '/account/admin?active=1')
      .pipe(
        map((res: any) => {
          const accounts: Account[] = [];
          res.forEach((p: any) => {
            accounts.push(new Account(p));
          });
          return accounts;
        })
      );
  }

  getArchivedAccountss(): Observable<Account[]> {
    return this.http
      .get(environment.serverUrl + '/account/admin?active=0')
      .pipe(
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

  syncAccount(form: any) {
    const pb = {
      username: form.email,
      password: form.password
    };
    return this.http.post(environment.serverUrl + '/auth/eqw', pb);
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
