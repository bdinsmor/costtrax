import { animate, animateChild, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { debounce } from 'rxjs/operators';

import { timer } from '../../node_modules/rxjs';
import { environment } from '../environments/environment';
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
  loggedIn = false;
  loading = false;
  roles: String[];
  uberAdmin = false;
  loginForm: FormGroup;
  isLoading = false;
  duration = 3000;
  debouncedExample: Observable<any>;
  shrinkToolbar = false;
  SHRINK_TOP_SCROLL_POSITION = 50;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) {
    this.debouncedExample = this.authService.getCreds().pipe(
      debounce(() => timer(250)),
      untilDestroyed(this)
    );
  }

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }

  ngOnDestroy() {}

  ngOnInit() {
    if (environment.production) {
      Logger.enableProductionMode();
    }

    this.debouncedExample.pipe(untilDestroyed(this)).subscribe(message => {
      if (message && message.userName) {
        this.loggedIn = true;
        this.uberAdmin = message.uberAdmin;
      } else {
        this.uberAdmin = false;
        this.loggedIn = false;
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
