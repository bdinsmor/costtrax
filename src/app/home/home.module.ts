import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';

import { DirectivesModule } from '../core/directives/directives';
import { PipesModule } from '../core/pipes/pipes.module';
import { HomeComponent } from '../home/home.component';
import { LineItemsModule } from '../line-items/line-items.module';
import { ProjectFormDialogComponent } from '../projects/project-form/project-form-dialog.component';
import { ProjectsModule } from '../projects/projects.module';
import { RequestDetailsComponent } from '../requests/request-details/request-details.component';
import { RequestsModule } from '../requests/requests.module';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CdkTableModule,
    SharedModule,
    DirectivesModule,
    PipesModule,
    RequestsModule,
    LineItemsModule,
    ProjectsModule
  ],
  exports: [HomeComponent],
  entryComponents: [ProjectFormDialogComponent, RequestDetailsComponent]
})
export class HomeModule {}
