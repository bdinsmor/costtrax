import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BreadcrumbService } from 'src/app/core/breadcrumbs/breadcrumbs.service';

import { Account } from '../../shared/model';
import { AccountService } from '../accounts.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  private config: MatSnackBarConfig;
  duration = 3000;

  isLoading = false;
  error: string;
  passwordError: string;
  accountForm: FormGroup;
  @Input() account: Account;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.createForm();
  }

  ngOnDestroy() {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.accountService
        .getAccount(id)
        .pipe(untilDestroyed(this))
        .subscribe((account: Account) => {
          this.account = account;
          this.breadcrumbService.addAccount(
            this.account.id,
            this.account.organization
          );
          this.changeDetector.detectChanges();
        });
    }
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  createAccount() {}

  cancelAccount() {}

  refreshAccount() {
    this.accountService
      .getAccount(this.account.id)
      .pipe(untilDestroyed(this))
      .subscribe((account: Account) => {
        this.account = account;
        this.changeDetector.detectChanges();
      });
  }

  createForm() {
    this.accountForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      accountName: ['', Validators.required]
    });
  }

  accountChanged(event) {
    if (event && event.action === 'delete') {
      this.refreshAccount();
      return;
    }

    this.accountService
      .update(this.account)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.openSnackBar('Account Updated!', 'ok', 'OK');
          this.refreshAccount();
        },
        (error: any) => {
          this.openSnackBar('Error Updating Account', 'error', 'OK');
        }
      );
  }
}
