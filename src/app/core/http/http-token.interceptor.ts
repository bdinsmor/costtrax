import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthenticationService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    let changedRequest = request;
    let token;
    const headerSettings: { [name: string]: string | string[] } = {};
    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }
    if (this.auth.isAuthenticated()) {
      token = await this.auth.credentials.token;
    } else {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
    if (!request.url.includes(environment.attachmentURL)) {
      headerSettings['Authorization'] = 'Bearer ' + token;
      headerSettings['Cache-Control'] = 'no-cache';
      headerSettings['Pragma'] = 'no-cache';
      headerSettings['Expires'] = 'Sat, 01 Jan 2000 00:00:00 GMT';
    }
    const newHeader = new HttpHeaders(headerSettings);
    changedRequest = request.clone({
      headers: newHeader
    });
    return next.handle(changedRequest).toPromise();
  }
}
