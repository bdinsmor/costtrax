import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { MailService } from '../../mail.service';
import { MailComposeDialogComponent } from '../../dialogs/compose/compose.component';

@Component({
  selector: 'app-mail-main-sidenav',
  templateUrl: './main-sidenav.component.html',
  styleUrls: ['./main-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailMainSidenavComponent {
  labels: any[];
  accounts: object;
  selectedAccount: string;
  dialogRef: any;

  folders$: Observable<any>;
  filters$: Observable<any>;
  labels$: Observable<any>;

  constructor(private mailService: MailService, public dialog: MatDialog) {
    // Data
    this.accounts = {
      creapond: 'johndoe@creapond.com',
      withinpixels: 'johndoe@withinpixels.com'
    };

    this.selectedAccount = 'creapond';
  }

  composeDialog() {
    this.dialogRef = this.dialog.open(MailComposeDialogComponent, {
      panelClass: 'mail-compose-dialog'
    });
    this.dialogRef.afterClosed().subscribe((response: any) => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];
      switch (actionType) {
        /**
         * Send
         */
        case 'send':
          console.log('new Mail', formData.getRawValue());
          break;
        /**
         * Delete
         */
        case 'delete':
          console.log('delete Mail');
          break;
      }
    });
  }
}
