import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { LIST_FADE_ANIMATION } from '../../core/utils/list.animation';

@Component({
  selector: 'app-toolbar-user-button',
  templateUrl: './toolbar-user-button.component.html',
  styleUrls: ['./toolbar-user-button.component.scss'],
  animations: [...LIST_FADE_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserButtonComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isOpen: boolean;
  version: string;
  userName: string;
  loginForm: FormGroup;
  isLoading = false;
  accountSynced = false;
  @Output()
  advantageSync = new EventEmitter();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cd: ChangeDetectorRef
  ) {
    this.version = environment.version;
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.authenticationService
      .getCreds()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        if (message && message.userName) {
          this.userName = message.userName;
          this.accountSynced =
            message.advantageId && message.advantageId !== '';
        } else {
          this.userName = '';
          this.accountSynced = false;
        }
        this.cd.detectChanges();
      });
  }

  logout() {
    this.toggleDropdown();
    this.authenticationService
      .logout()
      .pipe(untilDestroyed(this))
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get email(): string {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.email : null;
  }

  ngAfterViewInit() {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  syncAccounts() {
    this.isOpen = false;
    this.advantageSync.emit();
  }
}
