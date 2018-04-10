import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Project } from '@app/shared/model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { OBSERVABLE_MEDIA_PROVIDER_FACTORY } from '@angular/flex-layout';

@Injectable()
export class ProjectsService extends EntityServiceBase<Project> {
  onFilterChanged: Subject<any> = new Subject();
  projects: Project[] = [];
  constructor(private http: HttpClient, entityServiceFactory: EntityServiceFactory) {
    super('Projects', entityServiceFactory);
  }

  findById(id: string): Observable<Project> {
    if (!this.projects || this.projects.length === 0) {
      throw new Error('Could not find project');
    }
    return of(this.projects.find(x => x.id === id));
  }

  getProject(id: string): Observable<Project> {
    return this.http
      .get('https://hermes-api.development.equipmentwatchapi.com/project/' + id + '/requests')
      .map((res: any) => {
        const json = res as any;
        console.log('inside getProject: ' + JSON.stringify(res, null, 2));
        return json as Project;
      });
  }

  buildProjects(list: any[]) {
    const requestMap: Map<string, Request> = new Map<string, Request>();
    this.projects = [];
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const project: Project = new Project({});
      project.id = p.id;
      project.name = p.name;
      project.owner = p.owner;
      this.projects.push(project);
    }
  }
}
