import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  email: string;

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService
  ) {}

  @Output() toggledSidenav = new EventEmitter();

  ngOnInit() {
    const credentials = this.authenticationService.credentials;
    this.email = credentials.email ? credentials.email : null;
  }

  logout() {
    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  toggleSidenav() {
    this.toggledSidenav.emit();
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
