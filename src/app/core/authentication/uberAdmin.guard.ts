import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Logger } from '../logger.service';
import { AuthenticationService } from './authentication.service';

const log = new Logger('UberAdminGuard');

@Injectable()
export class UberAdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('checking uber...');
    return true;
    // return this.authenticationService.isUberAdmin();
  }
}
