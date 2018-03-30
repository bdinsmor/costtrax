import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { appAnimations } from '@app/core/animations';

import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectsService } from './projects.service';
import { Request, Project } from '@app/shared/model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class ProjectsComponent implements OnInit, OnDestroy {
  searchInput: FormControl;
  dialogRef: any;
  projects$: Observable<Project[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(private projectsService: ProjectsService, public dialog: MatDialog) {
    this.searchInput = new FormControl('');
    this.projects$ = projectsService.entities$;
    this.loading$ = projectsService.loading$;
    this.count$ = projectsService.count$;
  }

  ngOnInit() {
    this.getData();
    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        console.log('searchText: ' + searchText);
        const query = 'project.name=' + searchText;
        this.projectsService.clearCache();
        this.projectsService.getWithQuery(searchText);
      });
  }

  getData(): void {
    this.projectsService.getAll();

    // console.log('number of messages: ' + JSON.stringify(this.messagesService.count$));
  }
  add(m: Project) {
    this.projectsService.add(m);
  }

  delete(m: Project) {
    this.projectsService.delete(m.id);
  }
  update(m: Project) {
    this.projectsService.update(m);
  }

  ngOnDestroy() {}
}
