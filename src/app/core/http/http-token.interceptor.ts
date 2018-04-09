import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.fromPromise(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    let changedRequest = request;
    let token;
    const headerSettings: { [name: string]: string | string[] } = {};
    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }
    if (this.auth.isAuthenticated()) {
      token = await this.auth.credentials.token;
    }
    if (token) {
      headerSettings['Authorization'] = 'Bearer ' + token;
    }
    headerSettings['x-api-key'] = 'almighty';
    const newHeader = new HttpHeaders(headerSettings);
    changedRequest = request.clone({
      headers: newHeader
    });
    return next.handle(changedRequest).toPromise();
  }
}
