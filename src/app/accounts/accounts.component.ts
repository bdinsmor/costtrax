import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { Account } from '../shared/model';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountService } from './accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {
  accounts: Account[];
  canCreateAccounts = false;
  private config: MatSnackBarConfig;
  duration = 3000;

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadActiveAccounts();
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  ngOnDestroy(): void {}

  createAccount() {
    const dialogRef = this.dialog.open(AccountFormComponent, {
      panelClass: 'account-dialog-container',
      width: '60vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.openSnackBar('Account was added', 'OK', 'OK');
        this.loadActiveAccounts();
      }
    });
  }

  loadActiveAccounts() {
    this.accountService.getActiveAccounts().subscribe(accts => {
      this.accounts = accts;
    });
  }
}
