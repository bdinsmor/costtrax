import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridSortOrder } from '@clr/angular';

import { appAnimations } from '../../core/animations';
import { Account } from '../../shared/model';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  animations: appAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountListComponent implements OnInit {
  descSort = ClrDatagridSortOrder.DESC;
  @Input()
  accounts: Account[];

  constructor(public router: Router) {}

  ngOnInit() {}

  viewAccount(account: Account) {
    this.router.navigate(['../accounts', account.id]);
  }
}
