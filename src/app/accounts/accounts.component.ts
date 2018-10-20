import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Account } from '../shared/model';
import { AccountService } from './accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {
  activeAccounts$: Observable<Account[]>;
  archivedAccounts$: Observable<Account[]>;
  canCreateAccounts = false;
  _accountModalOpen = false;
  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadActiveAccounts();
  }

  ngOnDestroy(): void {}

  createAccount() {
    this._accountModalOpen = true;
  }

  createCancel() {
    this._accountModalOpen = false;
  }

  saveAccount(event: any) {
    console.log('event: ' + JSON.stringify(event, null, 2));
    /*this.accountService.create(event).subscribe((res: any) => {
      if (res) {
        this.loadActiveAccounts();
        this._accountModalOpen = false;
      }
    });*/
  }

  loadActiveAccounts() {
    this.activeAccounts$ = this.accountService.getActiveAccounts();
  }

  loadArchivedAccounts() {
    this.archivedAccounts$ = this.accountService.getArchivedAccountss();
  }
}
