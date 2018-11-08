import { animate, animateChild, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  subscription: Subscription;
  loggedIn = false;
  roles: String[];
  uberAdmin = false;
  loginForm: FormGroup;
  isLoading = false;
  _syncAccountModal = false;
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

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    this.subscription = this.authService.getCreds().subscribe(message => {
      if (message) {
        this.uberAdmin = message.uberAdmin;
        this.loggedIn = true;
      } else {
        this.uberAdmin = false;
        this.loggedIn = false;
      }
    });
  }

  syncAccounts() {
    const dialogRef = this.dialog.open(SyncDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
