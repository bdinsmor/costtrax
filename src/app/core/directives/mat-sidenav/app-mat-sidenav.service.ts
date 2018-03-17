import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable()
export class AppMatSidenavHelperService {
  sidenavInstances: MatSidenav[];

  constructor() {
    this.sidenavInstances = [];
  }

  setSidenav(id: string, instance: any) {
    this.sidenavInstances[id] = instance;
  }

  getSidenav(id: string) {
    return this.sidenavInstances[id];
  }
}
