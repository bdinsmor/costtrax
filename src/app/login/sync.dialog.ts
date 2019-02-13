import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../core';
import { appAnimations } from '../core/animations';
import { AccountService } from './../accounts/accounts.service';

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
  private config: MatSnackBarConfig;
  duration = 3000;

  constructor(
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  openSnackBar(message: string, type: string = 'OK', action: string = 'OK') {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

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
        (credentials: any) => {
          if (credentials.error) {
            this.error = credentials.error;
          } else {
            this.authenticationService.setCreds(credentials.token);
            this.openSnackBar('EquipmentWatch account synced');
            this.dialogRef.close({ success: true });
          }
        },
        (error: Error) => {
          this.openSnackBar('EquipmentWatch account could not be synced');
          this.error = error.message;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', Validators.required],
      remember: true
    });
  }
}
