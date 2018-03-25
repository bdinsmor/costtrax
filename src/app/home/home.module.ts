import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { MailModule } from '@app/mail/mail.module';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { RequestsModule } from '@app/requests/requests.module';
import { ProjectsModule } from '@app/projects/projects.module';
import { LogEntryService } from './activity.service';
import { ContractorsModule } from '../contractors/contractors.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    PipesModule,
    FlexLayoutModule,
    MaterialModule,
    MailModule,
    ContractorsModule,
    RequestsModule,
    ProjectsModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent],
  entryComponents: [],
  providers: [LogEntryService]
})
export class HomeModule {}
