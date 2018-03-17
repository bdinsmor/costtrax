import { InMemoryDbService } from 'angular-in-memory-web-api';
import { MailFakeDb } from './mail';
import { FileManagerFakeDb } from './file-manager';
import { ContactsFakeDb } from './contacts';

export class FakeDbService implements InMemoryDbService {
  contactsDB: ContactsFakeDb;

  createDb() {
    this.contactsDB = new ContactsFakeDb();
    console.log('inside createDb');
    return {
      // Mail
      mails: MailFakeDb.mails,
      folders: MailFakeDb.folders,
      filters: MailFakeDb.filters,
      labels: MailFakeDb.labels, // File Manager

      contacts: this.contactsDB.contacts()
    };
  }
}
