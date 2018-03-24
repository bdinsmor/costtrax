import { InMemoryDbService } from 'angular-in-memory-web-api';
import { RequestsFakeDb } from './requests';
import { Request, Company, Project, Activity, LogEntry } from '@app/shared/model';
import { Contact } from '@app/contacts/contact.model';

export class FakeDbService implements InMemoryDbService {
  requestsDB: RequestsFakeDb;

  createDb() {
    this.requestsDB = new RequestsFakeDb();
    const companies: Array<Company> = this.requestsDB.companies;
    const contacts: Array<Contact> = this.requestsDB.contacts;
    const projects: Array<Project> = this.requestsDB.projects;
    const requests: Array<Request> = this.requestsDB.requests;
    const activity: Array<Activity> = this.requestsDB.activities;
    const logEntries: Array<LogEntry> = this.requestsDB.logEntries;

    // this creates a url path for each entry
    // /projects -> returns projects list, /logentries -> returns list of logEntries...
    return {
      contacts: contacts,
      activity: activity,
      projects: projects,
      logentries: logEntries,
      companies: companies,
      requests: requests
    };
  }
}
