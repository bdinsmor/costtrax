import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Account, User } from '../shared/model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accounts: Account[];
  constructor(private http: HttpClient) {}

  create(account: Account): Observable<any> {
    const pb = {
      organization: account.accountName,
      accountAdmins: account.users.map((user: any) => {
        return user.email;
      })
    };
    return this.http.post(environment.serverUrl + '/account', pb);
  }

  archive(accountId: string) {
    return this.http.post(environment.serverUrl + '/account/' + accountId, {
      active: false
    });
  }

  delete(accountId: string) {
    return this.http.delete(environment.serverUrl + '/account/' + accountId);
  }

  deleteUser(accountId: string, userId: string) {
    return this.http.delete(
      environment.serverUrl + '/account/' + accountId + '/user/' + userId
    );
  }

  update(account: Account) {
    const admins = [];
    account.users.forEach((u: User) => {
      admins.push({ email: u.email, roles: u.roles });
    });
    return this.http.post(
      environment.serverUrl + '/account/' + account.id + '/users',
      {
        users: admins
      }
    );
  }

  getAdminAccounts(): Observable<Account[]> {
    return this.http
      .get(environment.serverUrl + '/account?role=AccountAdmin')
      .pipe(
        map((res: any) => {
          const accounts: Account[] = [];
          res.forEach((p: any) => {
            accounts.push(new Account(p));
          });
          this.accounts = accounts;
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
    if (this.accounts) {
      let account: Account = null;
      this.accounts.forEach((a: Account) => {
        if (a.id === id) {
          account = a;
        }
      });
      return of(account);
    } else {
      return this.http.get(environment.serverUrl + '/account/' + id).pipe(
        map((res: any) => {
          const json = res as any;
          return json as Account;
        })
      );
    }
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
