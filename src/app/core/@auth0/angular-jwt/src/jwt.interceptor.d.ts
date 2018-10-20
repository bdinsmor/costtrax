import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtHelperService } from './jwthelper.service';

export declare class JwtInterceptor implements HttpInterceptor {
  jwtHelper: JwtHelperService;
  tokenGetter: () => string | Promise<string>;
  headerName: string;
  authScheme: string;
  whitelistedDomains: Array<string | RegExp>;
  blacklistedRoutes: Array<string | RegExp>;
  throwNoTokenError: boolean;
  skipWhenExpired: boolean;
  constructor(config: any, jwtHelper: JwtHelperService);
  isWhitelistedDomain(request: HttpRequest<any>): boolean;
  isBlacklistedRoute(request: HttpRequest<any>): boolean;
  handleInterception(
    token: string,
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>>;
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>>;
}
