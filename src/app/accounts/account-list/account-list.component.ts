import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { ClrDatagridSortOrder } from '@clr/angular';

import { appAnimations } from '../../core/animations';
import { Account } from '../../shared/model';
import { AccountService } from '../accounts.service';

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
  selectedAccount: Account;
  private config: MatSnackBarConfig;
  duration = 3000;

  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    private accountService: AccountService
  ) {}

  ngOnInit() {}

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  viewAccount(account: Account) {
    this.router.navigate(['../accounts', account.id]);
  }

  archiveAccount(account: Account) {
    this.selectedAccount = account;
  }

  cancelArchiveAccount() {
    this.selectedAccount = null;
  }

  confirmArchiveAccount() {
    this.accountService.archive(this.selectedAccount.id).subscribe(
      (response: any) => {
        this.openSnackBar('Account marked COMPLETE!', 'ok', 'OK');
        this.router.navigate(['../accounts']);
      },
      (error: any) => {
        this.openSnackBar('Error Archiving Account', 'error', 'OK');
      }
    );
  }

  confirmDeleteAccount() {
    this.accountService.delete(this.selectedAccount.id).subscribe(
      (response: any) => {
        this.openSnackBar('Account deleted!', 'ok', 'OK');
        this.router.navigate(['../accounts']);
      },
      (error: any) => {
        this.openSnackBar('Error Deleting Account', 'error', 'OK');
      }
    );
  }
}
