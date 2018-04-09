import { retry } from 'rxjs/operator/retry';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface Credentials {
  // Customize received credentials here
  email: string;
  roles: string[];
  token: string;
}

export interface LoginContext {
  email: string;
  password: string;
  newPassword: string;
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

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
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
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable('Something bad happened; please try again later.');
  }

  login(context: LoginContext): Observable<Credentials> {
    const data = {
      email: context.email,
      password: context.password
    };
    return this.http.post('https://hermes-api.development.equipmentwatchapi.com/idam/login', data).map((res: any) => {
      if (res.error) {
        throw new ErrorObservable('Email/Password combination was not correct.');
      }
      const token = res.token as any;
      const creds = { email: context.email, token: token };
      // console.log('json: ' + JSON.stringify(this.jwtHelper.decodeToken(token), null, 2));
      this.setCredentials(creds as Credentials, context.remember);
      return creds as Credentials;
    });
  }

  reset(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    const data = { email: context.email, token: '123456' };
    return this.http
      .post('https://hermes-api.development.equipmentwatchapi.com/idam/reset', {
        email: context.email,
        password: context.password,
        newpassword: context.newPassword
      })
      .retry(3)
      .map((res: any) => {
        const json = res as any;

        return json.data as Credentials;
      });
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
