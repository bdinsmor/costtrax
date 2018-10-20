import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthenticationService, Logger } from '../core';
import { appAnimations } from '../core/animations';
import { Error403 } from '../shared/model';

const log = new Logger('Login');
export class PasswordMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: appAnimations
})
export class LoginComponent implements OnInit {
  version: string = environment.version;
  error: string;
  passwordError: string;
  loginForm: FormGroup;
  isLoading = false;
  changePassword = false;

  matcher = new PasswordMatcher();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.changePassword = false;
    this.authenticationService.logout();
  }

  updatePassword() {
    this.isLoading = true;
    this.authenticationService
      .reset(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        credentials => {
          log.debug(`${credentials.email} successfully logged in`);
          this.router.navigate(['/'], { replaceUrl: true });
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.passwordError = error;
        }
      );
  }

  private createChangePasswordForm() {
    this.loginForm = this.formBuilder.group(
      {
        email: [
          this.loginForm.get('email').value,
          [Validators.required, Validators.email]
        ],
        password: [this.loginForm.get('password').value, Validators.required],
        confirm_password: ['', Validators.required],
        confirm_password2: ['', Validators.required]
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    const pass = group.controls.confirm_password.value;
    const confirmPass = group.controls.confirm_password2.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  login() {
    this.isLoading = true;
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        credentials => {
          log.debug(`${credentials.email} successfully logged in`);
          this.router.navigate(['/'], { replaceUrl: true });
        },
        (error: Error) => {
          console.log('email: ' + this.loginForm.get('email').value);
          if (error instanceof Error403) {
            this.createChangePasswordForm();
            this.changePassword = true;
          }
          log.debug(`ogin error: ${error.message}`);
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
