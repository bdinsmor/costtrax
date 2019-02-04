import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { untilDestroyed } from 'ngx-take-until-destroy';
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
export class LoginComponent implements OnInit, OnDestroy {
  version: string = environment.version;
  mode = 'login';
  error: string;
  passwordError: string;
  loginForm: FormGroup;
  codeResetForm: FormGroup;
  isLoading = false;
  changePassword = false;
  forgotPassword = false;
  minPasswordLength = 8;
  resetSuccess = false;
  private config: MatSnackBarConfig;
  duration = 3000;

  matcher = new PasswordMatcher();
  @ViewChild(CountdownComponent) counter: CountdownComponent;
  resetTimer() {
    this.counter.restart();
  }

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  openSnackBar(message: string, type: string = 'ok', action: string = 'ok') {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  ngOnInit() {
    this.changePassword = false;
    this.authenticationService.logout();
  }

  ngOnDestroy() {}

  forgetPassword() {
    // this.createForgetPasswordForm();
    this.mode = 'forgot';
    this.createForgetPasswordForm();
  }

  cancelForgot() {
    this.mode = 'login';
    this.createForm();
  }

  goToLogin() {
    this.mode = 'login';
    this.resetSuccess = false;
    this.changePassword = false;
    this.forgotPassword = false;
    this.createForm();
    this.loginForm.markAsPristine();
  }

  submitForgot() {
    this.error = null;
    this.isLoading = true;
    this.authenticationService
      .forgotPassword(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        email => {
          log.debug(`${email} successfully forgot password`);
          this.mode = 'code-reset';

          this.createResetPasswordForm();
        },
        (error: Error) => {
          if (error instanceof Error403) {
            this.router.navigate(['/'], { replaceUrl: true });
          }
          this.resetTimer();
          log.debug(`login error: ${error.message}`);
          this.error = error.message;
        }
      );
  }

  resendCode() {
    this.error = null;
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
          this.openSnackBar('Verification Code has been re-sent');
          this.mode = 'code-reset';
        },
        (error: Error) => {
          if (error instanceof Error403) {
            this.createChangePasswordForm();
            this.changePassword = true;
          }
          this.mode = 'code-reset';
          log.debug(`login error: ${error.message}`);
          this.error = error.message;
        }
      );
  }

  submitNewPassword() {
    this.error = null;
    this.isLoading = true;
    this.authenticationService
      .submitReset(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        success => {
          this.openSnackBar('Password has been reset!');
          this.resetSuccess = success;
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.passwordError = error;
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
        }),
        untilDestroyed(this)
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

  onTimerFinished() {
    this.error = null;
  }

  private createForgetPasswordForm() {
    this.error = null;
    this.loginForm = this.formBuilder.group({
      email: [
        this.loginForm.get('email').value,
        [Validators.required, Validators.email]
      ]
    });
  }

  private createResetPasswordForm() {
    this.error = null;
    this.loginForm = this.formBuilder.group(
      {
        email: [
          this.loginForm.get('email').value,
          [Validators.required, Validators.email]
        ],
        confirm_password: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(this.minPasswordLength),
            Validators.required,
            Validators.pattern(
              '^(?=[0-9a-zA-Z#@$!?]{8,}$)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^0-9]*[0-9]).*'
            )
          ])
        ),
        confirm_password2: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(this.minPasswordLength),
            Validators.required,
            Validators.pattern(
              '^(?=[0-9a-zA-Z#@$!?]{8,}$)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^0-9]*[0-9]).*'
            )
          ])
        ),
        resetCode: new FormControl(
          '',
          Validators.compose([Validators.minLength(6), Validators.required])
        )
      },
      { validator: this.checkPasswords }
    );
  }

  private createChangePasswordForm() {
    this.error = null;
    this.loginForm = this.formBuilder.group(
      {
        email: [
          this.loginForm.get('email').value,
          [Validators.required, Validators.email]
        ],
        password: [this.loginForm.get('password').value, Validators.required],
        confirm_password: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(this.minPasswordLength),
            Validators.required,
            Validators.pattern(
              '^(?=[0-9a-zA-Z#@$!?]{8,}$)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^0-9]*[0-9]).*'
            )
          ])
        ),
        confirm_password2: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(this.minPasswordLength),
            Validators.required,
            Validators.pattern(
              '^(?=[0-9a-zA-Z#@$!?]{8,}$)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^0-9]*[0-9]).*'
            )
          ])
        )
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
    this.error = null;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: true
    });
  }
}
