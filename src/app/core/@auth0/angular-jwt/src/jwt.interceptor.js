import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from './jwthelper.service';
import { JWT_OPTIONS } from './jwtoptions.token';
import { Observable, from } from 'rxjs';
var URL = require('url');
var JwtInterceptor = (function() {
  function JwtInterceptor(config, jwtHelper) {
    this.jwtHelper = jwtHelper;
    this.tokenGetter = config.tokenGetter;
    this.headerName = config.headerName || 'Authorization';
    this.authScheme =
      config.authScheme || config.authScheme === ''
        ? config.authScheme
        : 'Bearer ';
    this.whitelistedDomains = config.whitelistedDomains || [];
    this.blacklistedRoutes = config.blacklistedRoutes || [];
    this.throwNoTokenError = config.throwNoTokenError || false;
    this.skipWhenExpired = config.skipWhenExpired;
  }
  JwtInterceptor.prototype.isWhitelistedDomain = function(request) {
    var requestUrl = URL.parse(request.url, false, true);
    return (
      this.whitelistedDomains.findIndex(function(domain) {
        return typeof domain === 'string'
          ? domain === requestUrl.host
          : domain instanceof RegExp
            ? domain.test(requestUrl.host)
            : false;
      }) > -1
    );
  };
  JwtInterceptor.prototype.isBlacklistedRoute = function(request) {
    var url = request.url;
    return (
      this.blacklistedRoutes.findIndex(function(route) {
        return typeof route === 'string'
          ? route === url
          : route instanceof RegExp
            ? route.test(url)
            : false;
      }) > -1
    );
  };
  JwtInterceptor.prototype.handleInterception = function(token, request, next) {
    var tokenIsExpired;
    if (!token && this.throwNoTokenError) {
      throw new Error('Could not get token from tokenGetter function.');
    }
    if (this.skipWhenExpired) {
      tokenIsExpired = token ? this.jwtHelper.isTokenExpired(token) : true;
    }
    if (token && tokenIsExpired && this.skipWhenExpired) {
      request = request.clone();
    } else if (
      token &&
      this.isWhitelistedDomain(request) &&
      !this.isBlacklistedRoute(request)
    ) {
      request = request.clone({
        setHeaders: ((_a = {}),
        (_a[this.headerName] = '' + this.authScheme + token),
        _a)
      });
    }
    return next.handle(request);
    var _a;
  };
  JwtInterceptor.prototype.intercept = function(request, next) {
    var _this = this;
    var token = this.tokenGetter();
    if (token instanceof Promise) {
      return from(token).mergeMap(function(asyncToken) {
        return _this.handleInterception(asyncToken, request, next);
      });
    } else {
      return this.handleInterception(token, request, next);
    }
  };
  return JwtInterceptor;
})();
export { JwtInterceptor };
JwtInterceptor.decorators = [{ type: Injectable }];
/** @nocollapse */
JwtInterceptor.ctorParameters = function() {
  return [
    { type: undefined, decorators: [{ type: Inject, args: [JWT_OPTIONS] }] },
    { type: JwtHelperService }
  ];
};
