import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Breadcrumb } from '../../shared/model';
import { BreadcrumbService } from './breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  crumbs: Breadcrumb[];
  subscription: Subscription;

  constructor(breadcrumbService: BreadcrumbService) {
    this.subscription = breadcrumbService.getBreadcrumbs().subscribe(b => {
      if (b) {
        this.crumbs = b.crumbs;
      } else {
        this.crumbs = [];
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
