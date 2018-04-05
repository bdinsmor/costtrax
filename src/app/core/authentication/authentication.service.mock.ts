import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Credentials, LoginContext } from './authentication.service';

export class MockAuthenticationService {
  credentials: Credentials | null = {
    email: 'test@test.com',
    token: '123',
    roles: []
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({ email: context.email, token: '123456', roles: [] });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }
}
