import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { appAnimations } from '@app/core/animations';
import { ConfirmDialogComponent } from '@app/core/components/confirm-dialog/confirm-dialog.component';

import { ContactsContactFormDialogComponent } from '../contact-form/contact-form.component';
import { ContactsService } from '../contacts.service';
import { Contact } from '@app/contacts/contact.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-contacts-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class ContactsContactListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  conctacts: Contact[];
  dataSource: ContactsDataSource | null;
  user: any;
  displayedColumns = ['select', 'name', 'lastName', 'address', 'company'];
  selectedContacts: any[];
  checkboxes: {};
  selection = new SelectionModel<Element>(true, []);
  dialogRef: any;

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private contactsService: ContactsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.checkboxes = {};
    this.contactsService.entities$.subscribe(contacts => {
      contacts.map(contact => {
        this.checkboxes[contact.id] = false;
      });
    });
    this.dataSource = new ContactsDataSource(this.contactsService);
  }

  masterToggle(): void {}
  isAllSelected(): void {}
  ngOnDestroy() {}

  editContact(contact: any) {
    this.dialogRef = this.dialog.open(ContactsContactFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        contact: contact,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: any) => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];
      switch (actionType) {
        /**
         * Save
         */
        case 'save':
          this.contactsService.update(formData.getRawValue());

          break;
        /**
         * Delete
         */
        case 'delete':
          this.deleteContact(contact);

          break;
      }
    });
  }

  /**
   * Delete Contact
   */
  deleteContact(contact: any) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactsService.delete(contact);
      }
      this.confirmDialogRef = null;
    });
  }

  onSelectedChange(contactId: any) {
    this.contactsService.toggleSelectedContact(contactId);
  }

  toggleStar(contactId: any) {
    if (this.user.starred.includes(contactId)) {
      this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
    } else {
      this.user.starred.push(contactId);
    }

    // this.contactsService.updateUserData(this.user);
  }
}

export class ContactsDataSource extends DataSource<any> {
  constructor(private contactsService: ContactsService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.contactsService.entities$;
  }
  length(): Observable<number> {
    return this.contactsService.count$;
  }

  disconnect() {}
}
