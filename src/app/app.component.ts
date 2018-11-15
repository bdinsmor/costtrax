import { animate, animateChild, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { Subscription } from '../../node_modules/rxjs';
import { environment } from '../environments/environment';
import { AccountService } from './accounts/accounts.service';
import { Logger } from './core';
import { AuthenticationService } from './core/authentication/authentication.service';
import { SyncDialogComponent } from './login/sync.dialog';

const log = new Logger('App');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routerAnimation', [
      transition('* => *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
          optional: true
        }),
        query(':enter', style({ transform: 'translateX(100%)' }), {
          optional: true
        }),
        sequence([
          query(':leave', animateChild(), { optional: true }),
          group([
            query(
              ':leave',
              [
                style({ transform: 'translateX(0%)' }),
                animate('200ms ease', style({ transform: 'translateX(-100%)' }))
              ],
              { optional: true }
            ),
            query(
              ':enter',
              [
                style({ transform: 'translateX(100%)' }),
                animate('200ms ease', style({ transform: 'translateX(0%)' }))
              ],
              { optional: true }
            )
          ]),
          query(':enter', animateChild(), { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  loggedIn = false;
  roles: String[];
  uberAdmin = false;
  loginForm: FormGroup;
  isLoading = false;
  private config: MatSnackBarConfig;
  duration = 3000;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private accountService: AccountService
  ) {}

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    this.subscription = this.authService.getCreds().subscribe(message => {
      if (message && message.userName) {
        this.loggedIn = true;
        this.uberAdmin = message.uberAdmin;
      } else {
        this.uberAdmin = false;
        this.loggedIn = false;
        console.log('LOGGED OUT!');
      }
    });
  }

  syncAccounts() {
    const dialogRef = this.dialog.open(SyncDialogComponent, {
      width: '40vw'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
