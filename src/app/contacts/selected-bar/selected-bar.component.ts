import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ContactsService } from '../contacts.service';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class ContactsSelectedBarComponent {
  selectedContacts: string[];
  hasSelectedContacts: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private contactsService: ContactsService, public dialog: MatDialog) {
    this.contactsService.onSelectedContactsChanged.subscribe(selectedContacts => {
      this.selectedContacts = selectedContacts;
      setTimeout(() => {
        this.hasSelectedContacts = selectedContacts.length > 0;
        this.isIndeterminate =
          selectedContacts.length !== this.contactsService.contacts.length && selectedContacts.length > 0;
      }, 0);
    });
  }

  selectAll() {
    this.contactsService.selectContacts();
  }

  deselectAll() {
    this.contactsService.deselectContacts();
  }

  deleteSelectedContacts() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected contacts?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactsService.deleteSelectedContacts();
      }
      this.confirmDialogRef = null;
    });
  }
}
