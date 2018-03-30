import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';

import { ProjectsComponent } from './projects.component';
import { ProjectsService } from './projects.service';
import { ProjectFormComponent } from './project-form/project-form.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { ProjectsListComponent } from '@app/projects/project-list/projects-list.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [ProjectsComponent, ProjectsListComponent, ProjectFormComponent],
  imports: [CdkTableModule, SharedModule, DirectivesModule, PipesModule],
  exports: [ProjectsComponent],
  providers: [ProjectsService, AppMatchMediaService],
  entryComponents: [ProjectFormComponent]
})
export class ProjectsModule {}
