import { InMemoryDbService } from 'angular-in-memory-web-api';
import { MailFakeDb } from './mail';
import { FileManagerFakeDb } from './file-manager';
import { ContactsFakeDb } from './contacts';
import { RequestsFakeDb } from './requests';
import { Request, Company, Project } from '@app/shared/model';
import { Contact } from '@app/contacts/contact.model';

export class FakeDbService implements InMemoryDbService {
  contactsDB: ContactsFakeDb;
  requestsDB: RequestsFakeDb;

  createDb() {
    // this.contactsDB = new ContactsFakeDb();
    this.requestsDB = new RequestsFakeDb();
    const companies: Array<Company> = this.requestsDB.companies;
    const contacts: Array<Contact> = this.requestsDB.contacts;
    const projects: Array<Project> = this.requestsDB.projects;
    const requests: Array<Request> = this.requestsDB.requests;
    console.log('number of projects: ' + projects.length);
    return {
      projects: projects,
      contacts: contacts,
      companies: companies,
      requests: requests
    };
  }
}
