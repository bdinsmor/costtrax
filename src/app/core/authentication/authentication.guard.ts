import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Logger } from '../logger.service';
import { AuthenticationService } from './authentication.service';

const log = new Logger('AuthenticationGuard');

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authenticationService.isAuthenticated()) {
      console.log("url: " + route.url);
      return true;
    }

    log.debug('Not authenticated, redirecting...');
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
}
