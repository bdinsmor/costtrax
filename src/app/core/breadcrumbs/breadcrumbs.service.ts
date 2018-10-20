import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Breadcrumb } from '../../shared/model';

@Injectable()
export class BreadcrumbService {
  private subject = new Subject<any>();
  private crumbs: Breadcrumb[];

  constructor() {
    this.crumbs = [];
  }

  setProjects() {
    this.crumbs = [];
    this.crumbs.push({ path: '/home', display: 'Home' } as Breadcrumb);
    this.crumbs.push({ path: '/projects', display: 'Projects' } as Breadcrumb);
  }

  addHome() {
    this.crumbs = [];
    this.crumbs.push({ path: '/home', display: 'Home' } as Breadcrumb);
  }

  addProjects() {
    this.crumbs.push({ path: '/projects', display: 'Projects' } as Breadcrumb);
    this.sendBreadcrumbs();
  }

  addProject(projectId: string, projectName: string) {
    this.setProjects();
    this.crumbs.push({
      path: '/projects/' + projectId,
      display: projectName
    } as Breadcrumb);
    this.sendBreadcrumbs();
  }

  addRequest(requestId: string, oneUp: string) {
    this.crumbs.push({
      path: '/requests/' + requestId,
      display: 'Request No. ' + oneUp
    } as Breadcrumb);
    this.sendBreadcrumbs();
  }

  addNewRequest() {
    this.crumbs.push({
      path: '',
      display: 'New Request'
    } as Breadcrumb);
    this.sendBreadcrumbs();
  }

  clear() {
    this.crumbs = [];
    this.sendBreadcrumbs();
  }

  sendBreadcrumbs() {
    if (this.crumbs) {
      this.subject.next({ crumbs: this.crumbs });
    } else {
      this.clearCrumbs();
    }
  }

  clearCrumbs() {
    this.subject.next();
  }

  getBreadcrumbs(): Observable<any> {
    return this.subject.asObservable();
  }
}
