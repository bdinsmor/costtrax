import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Account } from '../../shared/model';

export interface Credentials {
  // Customize received credentials here
  email: string;
  roles: string[];
  token: string;
  uberAdmin: boolean;
  decodedToken: string;
  accounts: Account[];
}

export interface LoginContext {
  email: string;
  password: string;
  confirm_password: string;
  confirm_password2: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: Credentials | null;
  private subject = new Subject<any>();

  constructor(private http: HttpClient) {
    const savedCredentials =
      sessionStorage.getItem(credentialsKey) ||
      localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an ErrorObservable with a user-facing error message
    return new Error('Something bad happened; please try again later.');
  }

  setUserAccounts(accounts: Account[]) {
    if (this.isAuthenticated()) {
      const creds = this.credentials;
      if (creds) {
        creds.accounts = accounts;
      }
    }
  }

  login(context: LoginContext): Observable<Credentials> {
    const data = {
      email: context.email,
      password: context.password
    };
    return this.http.post(environment.serverUrl + '/auth/login', data).pipe(
      map((res: any) => {
        if (res.error) {
          throw new Error('Email/Password combination was not correct.');
        }
        const token = res.token as any;

        // const token =
        // tslint:disable-next-line:max-line-length
        //  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNWJmMWY5ZC00YTJkLTQ4NzUtYjk3Yy1hZGI5Y2FiZjUzNjEiLCJlbWFpbCI6Imhlcm1lcy5yZXF1ZXN0b3JAbm9ydGhhdmV0ZWNoLmNvbSIsImlhdCI6MTUyNDQ0NDE5NSwiZXhwIjoxNTI0NTMwNTk1LCJpc3MiOiJpbmZvcm1hIn0.j9T-7N_RpYKJOULGhuUkRkLyaJ6Pn4caCwphTtAmxFY';
        const creds = { email: context.email, token: token };
        this.setCredentials(creds as Credentials, context.remember);
        return creds as Credentials;
      })
    );
  }

  reset(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    const data = { email: context.email, password: context.password };
    return this.http
      .post(environment.serverUrl + '/auth/reset', {
        email: context.email,
        password: context.password,
        newpassword: context.confirm_password
      })
      .pipe(
        map((res: any) => {
          if (res.error) {
            throw new Error('Email/Password combination was not correct.');
          }
          const token = res.token as any;

          // const token =
          // tslint:disable-next-line:max-line-length
          //  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNWJmMWY5ZC00YTJkLTQ4NzUtYjk3Yy1hZGI5Y2FiZjUzNjEiLCJlbWFpbCI6Imhlcm1lcy5yZXF1ZXN0b3JAbm9ydGhhdmV0ZWNoLmNvbSIsImlhdCI6MTUyNDQ0NDE5NSwiZXhwIjoxNTI0NTMwNTk1LCJpc3MiOiJpbmZvcm1hIn0.j9T-7N_RpYKJOULGhuUkRkLyaJ6Pn4caCwphTtAmxFY';
          const creds = { email: context.email, token: token };
          this.setCredentials(creds as Credentials, context.remember);
          return creds as Credentials;
        })
      );
  }

  /**
   * Logs out the user and clear credentials.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();

    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   */
  isAuthenticated(): boolean {
    if (!this.credentials) {
      return false;
    }
    const loggedIn =
      !!this.credentials && this.isTokenExpired(this.credentials.token, 0);
    if (loggedIn) {
      this.sendCreds(this.credentials);
    }
    return loggedIn;
  }

  isUberAdmin(): boolean {
    if (!this.credentials) {
      return false;
    }
    const loggedIn =
      !!this.credentials && this.isTokenExpired(this.credentials.token, 0);
    if (!loggedIn) {
      return false;
    } else {
      return this.credentials.uberAdmin;
    }
    return false;
  }

  public urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += '==';
        break;
      }
      case 3: {
        output += '=';
        break;
      }
      default: {
        throw new Error('Illegal base64url string!');
      }
    }
    return this.b64DecodeUnicode(output);
  }

  // credits for decoder goes to https://github.com/atk
  private b64decode(str: string): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 === 1) {
      throw new Error(
        '\'atob\' failed: The string to be decoded is not correctly encoded.'
      );
    }

    for (
      // initialize result and counters
      let bc = 0, bs: any, buffer: any, idx = 0;
      // get next character
      (buffer = str.charAt(idx++));
      // character found in table? initialize bit storage and add its ascii value;
      // tslint:disable-next-line:no-bitwise
      ~buffer &&
      ((bs = bc % 4 ? bs * 64 + buffer : buffer),
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4)
        ? // tslint:disable-next-line:no-bitwise
          (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  }

  private b64DecodeUnicode(str: any) {
    return decodeURIComponent(
      Array.prototype.map
        .call(this.b64decode(str), (c: any) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  decodeToken(token: string): any {
    if (token === null || token === undefined) {
      return null;
    }
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error(
        'The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.'
      );
    }

    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token.');
    }

    return JSON.parse(decoded);
  }

  getTokenExpirationDate(token: string): Date {
    let decoded: any;
    decoded = this.decodeToken(token);

    if (!decoded.hasOwnProperty('exp')) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  isTokenExpired = function(token, offsetSeconds) {
    if (token === void 0) {
      token = localStorage.getItem('access_token');
    }
    if (token === null || token === '') {
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (date === null) {
      return true;
    }
    const expired =
      date.valueOf() > new Date().valueOf() + offsetSeconds * 1000;
    return expired;
  };

  get credentials(): Credentials | null {
    return this._credentials;
  }

  setCreds(creds: any) {
    this._credentials.token = creds;
    this.setCredentials(this._credentials);
  }

  sendCreds(creds: Credentials) {
    if (creds && creds.email && creds.token) {
      const token = this.decodeToken(creds.token);
      if (token) {
        this.subject.next({
          userName: creds.email,
          roles: creds.roles,
          uberAdmin: token.uberAdmin,
          advantageId: token.advantageId
        });
      }
    } else {
      this.clearCreds();
    }
  }

  clearCreds() {
    this.subject.next();
  }

  getCreds(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      console.log('creds to set: ' + JSON.stringify(credentials, null, 2));
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
      this.sendCreds(credentials);
    } else {
      this.clearCreds();
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
