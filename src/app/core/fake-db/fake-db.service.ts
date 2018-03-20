import { InMemoryDbService } from 'angular-in-memory-web-api';
import { MailFakeDb } from './mail';
import { FileManagerFakeDb } from './file-manager';
import { ContactsFakeDb } from './contacts';
import { RequestsFakeDb } from './requests';
import { Request } from '@app/shared/model';

export class FakeDbService implements InMemoryDbService {
  contactsDB: ContactsFakeDb;
  requestsDB: RequestsFakeDb;

  createDb() {
    // this.contactsDB = new ContactsFakeDb();
    this.requestsDB = new RequestsFakeDb();
    const requests: Array<Request> = this.requestsDB.getRequests();
    // console.log('inside createDb: ' + JSON.stringify(requests[0], null, 2));
    return {
      // Mail
      mails: MailFakeDb.mails,
      folders: MailFakeDb.folders,
      filters: MailFakeDb.filters,
      labels: MailFakeDb.labels, // File Manager

      contacts: this.contactsDB.contacts(),
      requests: requests
    };
  }
}
