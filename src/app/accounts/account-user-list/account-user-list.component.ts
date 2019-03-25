import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { appAnimations } from 'src/app/core/animations';
import { User } from 'src/app/shared/model';

import { AccountUserFormComponent } from '../account-user-form/account-user-form.component';
import { AccountService } from '../accounts.service';
import { AccountUserDeleteDialogComponent } from './account-user-delete-dialog.component';

@Component({
  selector: 'app-account-user-list',
  templateUrl: './account-user-list.component.html',
  styleUrls: ['./account-user-list.component.scss'],
  animations: appAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountUserListComponent implements OnInit {
  private config: MatSnackBarConfig;
  duration = 3000;
  selectedIndex = -1;
  selectedItem: User;
  @Input() newAccount: boolean;
  @Input() accountId: string;
  @Input() users: User[];

  @Output() changed = new EventEmitter<any>();

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private accountService: AccountService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.users) {
      this.users = [];
    }
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  addAccountAdmin() {
    const dialogRef = this.dialog.open(AccountUserFormComponent, {
      width: '50vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.users.push(result.user);
        if (!this.newAccount) {
          console.log('not new account...');
          this.changed.emit({});
        } else {
          this.changeDetector.detectChanges();
        }
      }
    });
  }

  removeUser(index: number, item: User) {
    if (this.newAccount) {
      this.users.splice(index, 1);
      return;
    }
    this.selectedItem = item;
    this.selectedIndex = index;
    const dialogRef = this.dialog.open(AccountUserDeleteDialogComponent, {
      data: {
        user: item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.accountService
          .deleteUser(this.accountId, this.selectedItem.id)
          .subscribe(
            (response: any) => {
              this.openSnackBar('User Removed', 'ok', 'OK');
              this.changed.emit({});
              this.changeDetector.detectChanges();
              this.selectedIndex = -1;
              this.selectedItem = null;
            },
            (error: any) => {
              this.openSnackBar('User NOT Removed!', 'ok', 'OK');
            }
          );
        this.changeDetector.detectChanges();
      }
    });
  }
}
