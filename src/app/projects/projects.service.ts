import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Project } from '@app/shared/model';

@Injectable()
export class ProjectsService extends EntityServiceBase<Project> {
  onFilterChanged: Subject<any> = new Subject();
  projects: Project[] = [];
  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Projects', entityServiceFactory);
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
