import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Account, Project } from '../shared/model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  onFilterChanged: Subject<any> = new Subject();
  projects: Project[] = [];
  constructor(private http: HttpClient) {}

  findById(id: string): Observable<Project> {
    if (!this.projects || this.projects.length === 0) {
      // throw new Error('Could not find project');
      return of(new Project({}));
    }
    return of(this.projects.find(x => x.id === id));
  }

  getUsers(projectId: string): Observable<any> {
    return this.http.get(
      environment.serverUrl + '/project/' + projectId + '/user'
    );
  }

  completeProject(projectId: string): Observable<any> {
    return this.http.put(
      environment.serverUrl + '/project/' + projectId + '/complete',
      null
    );
  }

  inviteUser(projectId: string, invite: any): Observable<any> {
    return this.http.post(
      environment.serverUrl + '/project/' + projectId + '/user',
      invite
    );
  }

  deleteUser(projectId: string, userId: string) {
    return this.http.delete(
      environment.serverUrl + '/project/' + projectId + '/user/' + userId
    );
  }

  updateUser(projectId: string, userId: string, roles: string[]) {
    return this.http.put(
      environment.serverUrl + '/project/' + projectId + '/user/' + userId,
      { roles: roles }
    );
  }

  getProject(id: string): Observable<Project> {
    return this.http.get(environment.serverUrl + '/project/' + id).pipe(
      map((res: any) => {
        const json = res as any;
        // console.log('project json: ' + JSON.stringify(json, null, 1));
        return new Project(json);
      })
    );
  }

  getProjectRequests(id: string, status: string): Observable<Project> {
    return this.http.get(environment.serverUrl + '/project/' + id).pipe(
      map((res: any) => {
        const json = res as any;
        return new Project(json);
      })
    );
  }

  updateProject(project: any) {
    return this.http.put(
      environment.serverUrl + '/project/' + project.id,
      project
    );
  }

  getActiveProjects(): Observable<Project[]> {
    return this.http.get(environment.serverUrl + '/project?active=1').pipe(
      map((res: any) => {
        const projects: Project[] = [];
        res.forEach((p: any) => {
          //   console.log('project name: ' + p.name);
          projects.push(new Project(p));
        });
        projects.sort((n1, n2) => {
          if (n2.age > n1.age) {
            return -1;
          }

          if (n2.age < n1.age) {
            return 1;
          }

          return 0;
        });
        return projects;
      })
    );
  }

  getArchivedProjects(): Observable<Project[]> {
    return this.http.get(environment.serverUrl + '/project?active=0').pipe(
      map((res: any) => {
        const projects: Project[] = [];
        res.forEach((p: any) => {
          //   console.log('project name: ' + p.name);
          projects.push(new Project(p));
        });
        projects.sort((n1, n2) => {
          if (n2.age > n1.age) {
            return 1;
          }

          if (n2.age < n1.age) {
            return -1;
          }

          return 0;
        });
        return projects;
      })
    );
  }

  getProjectsForRequests(): Observable<Project[]> {
    return this.http.get(environment.serverUrl + '/project').pipe(
      map((res: any) => {
        const projects: Project[] = [];
        res.forEach((p: any) => {
          if (p.roles) {
            for (let i = 0; i < p.roles.length; i++) {
              if (p.roles[i] === 'RequestSubmit') {
                projects.push(new Project(p));
              }
            }
          }
        });
        return projects;
      })
    );
  }

  getProjectRoles(): Observable<string[]> {
    return this.http.get(environment.serverUrl + '/project').pipe(
      map((res: any) => {
        const roles = new Set();
        res.forEach((p: any) => {
          if (p.roles) {
            for (let i = 0; i < p.roles.length; i++) {
              roles.add(p.roles[i]);
            }
          }
        });
        return Array.from(roles);
      })
    );
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get(environment.serverUrl + '/account/' + id).pipe(
      map((res: any) => {
        const json = res as any;
        return json as Account;
      })
    );
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get(environment.serverUrl + '/account').pipe(
      map((res: any) => {
        const accounts: Account[] = [];
        res.forEach((a: any) => {
          accounts.push(new Account(a));
        });
        return accounts;
      })
    );
  }

  save(project: any) {
    return this.http.post(environment.serverUrl + '/project', project);
  }

  update(project: Project) {
    return this.http.put(environment.serverUrl + '/project', project).pipe(
      map((res: any) => {
        const json = res as any;
        return json;
      })
    );
  }

  buildProjects(list: any[]) {
    const requestMap: Map<string, Request> = new Map<string, Request>();
    this.projects = [];
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const project: Project = new Project({});
      project.id = p.id;
      project.name = p.name;
      project.description = p.description;
      this.projects.push(project);
    }
  }
}
