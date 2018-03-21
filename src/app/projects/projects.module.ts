import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { ProjectsComponent } from './projects.component';
import { ProjectsService } from './projects.service';
import { ProjectFormDialogComponent } from './project-form/project-form.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { ProjectsListComponent } from '@app/projects/project-list/projects-list.component';

const routes: Routes = [
  {
    path: 'projects',
    component: ProjectsComponent,
    resolve: {
      projects: ProjectsService
    }
  }
];

@NgModule({
  declarations: [ProjectsComponent, ProjectsListComponent, ProjectFormDialogComponent],
  imports: [
    CdkTableModule,
    CommonModule,
    DirectivesModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [ProjectsComponent],
  providers: [ProjectsService, AppMatchMediaService],
  entryComponents: [ProjectFormDialogComponent]
})
export class ProjectsModule {}
