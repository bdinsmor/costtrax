import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
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
  mode = 'login';
  error: string;
  passwordError: string;
  loginForm: FormGroup;
  isLoading = false;
  changePassword = false;
  forgotPassword = false;

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

  forgetPassword() {
    // this.createForgetPasswordForm();
    this.mode = 'forgot';
    this.createForgetPasswordForm();
  }

  cancelForgot() {
    this.mode = 'login';
    this.createForm();
  }

  submitForgot() {
    this.isLoading = true;
    this.authenticationService
      .forgotPassword(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        credentials => {
          log.debug(`${credentials.email} successfully forgot password`);
          this.router.navigate(['/'], { replaceUrl: true });
        },
        (error: Error) => {
          if (error instanceof Error403) {
            this.createChangePasswordForm();
            this.changePassword = true;
          }
          log.debug(`login error: ${error.message}`);
          this.error = error.message;
        }
      );
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

  private createForgetPasswordForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        this.loginForm.get('email').value,
        [Validators.required, Validators.email]
      ]
    });
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
          const redirect = this.authenticationService.redirectUrl
            ? this.authenticationService.redirectUrl
            : '/';
          this.router.navigate([redirect], { replaceUrl: true });
        },
        (error: Error) => {
          if (error instanceof Error403) {
            this.createChangePasswordForm();
            this.mode = 'change';
          }
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
