import { InMemoryDbService } from 'angular-in-memory-web-api';
import { RequestsFakeDb } from './requests';
import { Request, Company, Project, Activity, LogEntry, Contractor } from '@app/shared/model';
import { MailFakeDb } from './mail';

export class FakeDbService implements InMemoryDbService {
  requestsDB: RequestsFakeDb;

  createDb() {
    this.requestsDB = new RequestsFakeDb();
    const companies: Array<Company> = this.requestsDB.companies;
    const contractors: Array<Contractor> = this.requestsDB.contractors;
    const projects: Array<Project> = this.requestsDB.projects;
    const requests: Array<Request> = this.requestsDB.requests;
    const activity: Array<Activity> = this.requestsDB.activities;
    const logEntries: Array<LogEntry> = this.requestsDB.logEntries;

    // this creates a url path for each entry
    // /projects -> returns projects list, /logentries -> returns list of logEntries...
    return {
      // contractors: contractors,
      activity: activity,
      projects: projects,
      logentries: logEntries,
      companies: companies,
      messages: this.requestsDB.messages,
      requests: requests
    };
  }
}
