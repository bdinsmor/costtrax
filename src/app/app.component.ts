import { animate, animateChild, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { Subscription } from '../../node_modules/rxjs';
import { environment } from '../environments/environment';
import { Logger } from './core';
import { AuthenticationService } from './core/authentication/authentication.service';

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

  constructor(private authService: AuthenticationService) {}

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
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }
}
