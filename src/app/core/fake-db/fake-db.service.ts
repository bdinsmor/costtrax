import {
  RequestInfo,
  InMemoryDbService,
  ResponseOptions,
  RequestInfoUtilities,
  ParsedRequestUrl,
  getStatusText,
  STATUS
} from 'angular-in-memory-web-api';
import { RequestsFakeDb } from './requests';
import { Request, Company, Project, Activity, LogEntry, Contractor } from '@app/shared/model';

export class FakeDbService implements InMemoryDbService {
  requestsDB: RequestsFakeDb;

  // HTTP GET interceptor
  get(reqInfo: RequestInfo): any {
    const collectionName = reqInfo.collectionName;

    if (collectionName === 'requests') {
      return this.getRequests(reqInfo);
    } else if (collectionName === 'projects') {
      return this.getRequests(reqInfo);
    } else if (collectionName === 'companies') {
      return this.getRequests(reqInfo);
    } else if (collectionName === 'contractors') {
      return this.getRequests(reqInfo);
    } else if (collectionName === 'messages') {
      return this.getRequests(reqInfo);
    } else if (collectionName === 'logentries') {
      return this.getRequests(reqInfo);
    } else {
      return reqInfo.utils.createResponse$(() => {
        const options: ResponseOptions = { body: { error: getStatusText(404) }, status: STATUS.NOT_FOUND };
        return this.finishOptions(options, reqInfo);
      });
    }
  }

  // HTTP GET interceptor handles requests for villains
  private getRequests(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      const collectionName = reqInfo.collectionName;
      const collection = this.requestsDB[collectionName].slice();
      console.log('HTTP GET override:  ' + collectionName);
      const dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;
      const id = reqInfo.id;

      // tslint:disable-next-line:triple-equals
      let data = null;
      if (id) {
        data = reqInfo.utils.findById(collection, id);
        if (collectionName == 'requests') {
          console.log('material costs: ' + data.costs.materialCosts.materialCosts.length);
        }
      } else {
        data = collection;
      }
      const options: ResponseOptions = data
        ? { body: dataEncapsulation ? { data } : data, status: STATUS.OK }
        : { body: { error: `'Requests' with id='${id}' not found` }, status: STATUS.NOT_FOUND };
      return this.finishOptions(options, reqInfo);
    });
  }

  // intercept ResponseOptions from default HTTP method handlers
  // add a response header and report interception to console.log
  responseInterceptor(resOptions: ResponseOptions, reqInfo: RequestInfo) {
    resOptions.headers.set('x-test', 'test-header');
    const method = reqInfo.method.toUpperCase();
    const body = JSON.stringify(resOptions);
    // console.log(`responseInterceptor: ${method} ${reqInfo.req.url}: \n${body}`);

    return resOptions;
  }

  /////////// helpers ///////////////
  private finishOptions(options: ResponseOptions, { headers, url }: RequestInfo) {
    options.statusText = getStatusText(options.status);
    options.headers = headers;
    options.url = url;
    return options;
  }

  createDb() {
    this.requestsDB = new RequestsFakeDb();
    const companies: Array<Company> = this.requestsDB.companies;
    const contractors: Array<Contractor> = this.requestsDB.contractors;
    const projects: Array<Project> = this.requestsDB.projects;
    const requests: Array<Request> = this.requestsDB.requests;
    const activity: Array<Activity> = this.requestsDB.activities;
    const logentries: Array<LogEntry> = this.requestsDB.logentries;

    // this creates a url path for each entry
    // /projects -> returns projects list, /logentries -> returns list of logEntries...
    return {
      // contractors: contractors,
      activity: activity,
      projects: projects,
      logentries: logentries,
      companies: companies,
      messages: this.requestsDB.messages,
      requests: requests
    };
  }
}
