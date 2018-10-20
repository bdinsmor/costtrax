import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridSortOrder } from '@clr/angular';

import { appAnimations } from '../../core/animations';
import { Project } from '../../shared/model';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  animations: appAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListComponent implements OnInit {
  descSort = ClrDatagridSortOrder.DESC;
  @Input()
  projects: Project[];

  constructor(public router: Router) {}

  ngOnInit() {}

  openProject(project: Project) {
    this.router.navigate(['../projects', project.id]);
  }
}
