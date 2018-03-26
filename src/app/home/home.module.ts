import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { ProjectsListComponent } from '@app/projects/project-list/projects-list.component';
import { SharedModule } from '@app/shared';
import { HomeComponent } from '@app/home/home.component';
import { LogEntryService } from './home.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [CdkTableModule, SharedModule, DirectivesModule, PipesModule, RouterModule.forChild(routes)],
  exports: [HomeComponent],
  providers: [LogEntryService, AppMatchMediaService]
})
export class HomeModule {}
