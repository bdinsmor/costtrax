import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthenticationService, Logger } from '../core';
import { appAnimations } from '../core/animations';
import { AccountService } from './../accounts/accounts.service';

const log = new Logger('Login');

@Component({
  selector: 'app-sync-dialog',
  templateUrl: './sync.dialog.html',
  styleUrls: ['./sync.dialog.scss'],
  animations: appAnimations
})
export class SyncDialogComponent implements OnInit {
  version: string = environment.version;
  error: string;
  passwordError: string;
  loginForm: FormGroup;
  isLoading = false;
  changePassword = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  cancelSync() {
    this.isLoading = false;
    this.dialogRef.close();
  }

  syncLogin() {
    this.isLoading = true;
    this.accountService
      .syncAccount(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        credentials => {
          console.log('synced!');
          this.dialogRef.close({ success: true });
        },
        (error: Error) => {
          console.log('email: ' + this.loginForm.get('email').value);
          log.debug(`login error: ${error.message}`);
          this.error = error.message;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: true
    });
  }
}
