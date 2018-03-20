import { InMemoryDbService } from 'angular-in-memory-web-api';
import { MailFakeDb } from './mail';
import { FileManagerFakeDb } from './file-manager';
import { ContactsFakeDb } from './contacts';
import { RequestsFakeDb } from './requests';

export class FakeDbService implements InMemoryDbService {
  contactsDB: ContactsFakeDb;
  requestsDB: RequestsFakeDb;

  createDb() {
    this.contactsDB = new ContactsFakeDb();

    // num projects, num companies, num requests
    //  this.requestsDB = new RequestsFakeDb(15, 25, 250);
    console.log('inside createDb');
    return {
      // Mail
      mails: MailFakeDb.mails,
      folders: MailFakeDb.folders,
      filters: MailFakeDb.filters,
      labels: MailFakeDb.labels, // File Manager

      contacts: this.contactsDB.contacts()
      //  requests: this.requestsDB.getRequests()
    };
  }
}
