import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { RequestsComponent } from './requests.component';
import { RequestsService } from './requests.service';
import { RequestFormDialogComponent } from './request-form/request-form.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { RequestsListComponent } from '@app/requests/request-list/requests-list.component';

const routes: Routes = [
  {
    path: 'requests',
    component: RequestsComponent,
    resolve: {
      contacts: RequestsService
    }
  }
];

@NgModule({
  declarations: [RequestsComponent, RequestsListComponent, RequestFormDialogComponent],
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
  exports: [RequestsComponent],
  providers: [RequestsService, AppMatchMediaService],
  entryComponents: [RequestFormDialogComponent]
})
export class RequestsModule {}
