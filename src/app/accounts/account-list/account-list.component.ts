import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { ClrDatagridSortOrder } from '@clr/angular';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { appAnimations } from '../../core/animations';
import { Account } from '../../shared/model';
import { AccountService } from '../accounts.service';
import { AccountDeleteDialogComponent } from './account-delete-dialog.component';

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
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private accountService: AccountService,
    private changeDetector: ChangeDetectorRef
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
    this.accountService
      .archive(this.selectedAccount.id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.openSnackBar('Account Archived!', 'ok', 'OK');
          this.router.navigate(['../accounts']);
        },
        (error: any) => {
          this.openSnackBar('Error Archiving Account', 'error', 'OK');
        }
      );
  }

  removeAccount(account: Account) {
    const dialogRef = this.dialog.open(AccountDeleteDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.accountService.delete(account.id).subscribe((response: any) => {
          this.openSnackBar('Account Deleted!', 'ok', 'OK');
          this.router.navigate(['../accounts']);
        });
      }
    });
    this.changeDetector.detectChanges();
  }

  confirmDeleteAccount() {
    this.accountService
      .delete(this.selectedAccount.id)
      .pipe(untilDestroyed(this))
      .subscribe(
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
