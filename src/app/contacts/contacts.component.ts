import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { appAnimations } from '@app/core/animations';

import { ContactsContactFormDialogComponent } from './contact-form/contact-form.component';
import { ContactsService } from './contacts.service';
import { Contact } from '@app/contacts/contact.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class ContactsComponent implements OnInit, OnDestroy {
  hasSelectedContacts: boolean;
  searchInput: FormControl;
  dialogRef: any;
  contacts$: Observable<Contact[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  selected: Contact[];

  constructor(private contactsService: ContactsService, public dialog: MatDialog) {
    this.searchInput = new FormControl('');
    this.contacts$ = contactsService.entities$;
    this.loading$ = contactsService.loading$;
    this.count$ = contactsService.count$;
    this.selected = [];
  }

  newContact() {
    this.dialogRef = this.dialog.open(ContactsContactFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }

      this.contactsService.update(response.getRawValue());
    });
  }

  ngOnInit() {
    this.getContacts();
    //   this.searchInput.valueChanges
    //     .debounceTime(300)
    //    .distinctUntilChanged()
    //    .subscribe(searchText => {
    //      this.contactsService.onSearchTextChanged.next(searchText);
    //    });
  }

  getContacts(): void {
    this.contactsService.getAll();

    // console.log('number of messages: ' + JSON.stringify(this.messagesService.count$));
  }
  add(m: Contact) {
    this.contactsService.add(m);
  }

  delete(m: Contact) {
    this.contactsService.delete(m.id);
  }
  update(m: Contact) {
    this.contactsService.update(m);
  }

  select(m: Contact) {
    this.selected.push(m);
  }

  ngOnDestroy() {}
}
