import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { Contact } from '@app/contacts/contact.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ContactsService extends EntityServiceBase<Contact> {
  foldersArr: any;
  filtersArr: any;
  labelsArr: any;
  contacts: Contact[];
  selectedContacts: String[];
  onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onFilterChanged: Subject<any> = new Subject();

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Contacts', entityServiceFactory);
  }

  selectContacts(filterParameter?: any, filterValue?: any) {
    this.selectedContacts = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedContacts = [];
      this.contacts.map((contact: Contact) => {
        this.selectedContacts.push(contact.id);
      });
    } else {
      /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
    }

    // Trigger the next event
    this.onSelectedContactsChanged.next(this.selectedContacts);
  }

  deselectContacts() {
    this.selectedContacts = [];

    // Trigger the next event
    this.onSelectedContactsChanged.next(this.selectedContacts);
  }

  deleteContact(contact: Contact) {
    this.delete(contact);
  }

  deleteSelectedContacts() {
    for (const contactId of this.selectedContacts) {
      const contact = this.contacts.find(_contact => {
        return _contact.id === contactId;
      });
      const contactIndex = this.contacts.indexOf(contact);
      this.contacts.splice(contactIndex, 1);
    }
    this.deselectContacts();
  }

  /**
   * Toggle selected contact by id
   * @param id
   */
  toggleSelectedContact(id: String) {
    // First, check if we already have that todo as selected...
    if (this.selectedContacts.length > 0) {
      const index = this.selectedContacts.indexOf(id);

      if (index !== -1) {
        this.selectedContacts.splice(index, 1);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedContacts.push(id);

    // Trigger the next event
    this.onSelectedContactsChanged.next(this.selectedContacts);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedContacts.length > 0) {
      this.deselectContacts();
    } else {
      this.selectContacts();
    }
  }
}
