import { Injectable } from '@angular/core';
import { EntityServiceBase, EntityServiceFactory } from 'ngrx-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Project } from '@app/shared/model';

@Injectable()
export class ProjectsService extends EntityServiceBase<Project> {
  onFilterChanged: Subject<any> = new Subject();

  constructor(entityServiceFactory: EntityServiceFactory) {
    super('Projects', entityServiceFactory);
  }
}
