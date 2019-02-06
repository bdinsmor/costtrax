import { Component, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Breadcrumb } from '../../shared/model';
import { BreadcrumbService } from './breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  crumbs: Breadcrumb[];

  constructor(breadcrumbService: BreadcrumbService) {
    breadcrumbService
      .getBreadcrumbs()
      .pipe(untilDestroyed(this))
      .subscribe(b => {
        if (b) {
          this.crumbs = b.crumbs;
        } else {
          this.crumbs = [];
        }
      });
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
