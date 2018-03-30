import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';

import { RequestsComponent } from './requests.component';
import { RequestsService } from './requests.service';
import { RequestFormWizardComponent } from './request-form/request-form-wizard.component';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { RequestsListComponent } from '@app/requests/request-list/requests-list.component';
import { RequestFormDialogComponent } from '@app/requests/request-form-dialog/request-form.dialog.component';
import { SharedModule } from '@app/shared';
import { RequestFormComponent } from '@app/requests/request-form/request-form.component';

@NgModule({
  declarations: [
    RequestsComponent,
    RequestsListComponent,
    RequestFormComponent,
    RequestFormWizardComponent,
    RequestFormDialogComponent
  ],
  imports: [SharedModule, CdkTableModule, DirectivesModule, PipesModule],
  exports: [RequestsComponent],
  providers: [RequestsService, AppMatchMediaService],
  entryComponents: [RequestFormComponent, RequestFormDialogComponent]
})
export class RequestsModule {}
