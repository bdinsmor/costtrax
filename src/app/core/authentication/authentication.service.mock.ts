import { Observable, of } from 'rxjs';

import { Credentials, LoginContext } from './authentication.service';

export class MockAuthenticationService {
  credentials: Credentials | null = {
    email: 'test@test.com',
    token: '123',
    decodedToken: '',
    roles: [],
    accounts: []
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      email: context.email,
      token: '123456',
      decodedToken: '234',
      accounts: [],
      roles: []
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }
}
