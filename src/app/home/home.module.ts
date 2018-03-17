import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';
import { RequestsComponent } from '@app/requests/requests.component';
import { ProjectsComponent } from '@app/projects/projects.component';
import { ProjectDetailsDialogComponent } from '@app/project-details/project-dialog.component';
import { ProjectDetailsComponent } from '@app/project-details/project-details.component';
import { ProjectsService } from '../projects/projects.service';
import { RequestsService } from '../requests/requests.service';
import { ContactsModule } from '@app/contacts/contacts.module';
import { MailModule } from '@app/mail/mail.module';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { ContactsComponent } from '../contacts/contacts.component';

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
    ContactsModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    ProjectsComponent,
    ProjectDetailsDialogComponent,
    ProjectDetailsComponent,
    RequestsComponent
  ],
  entryComponents: [ProjectDetailsDialogComponent],
  providers: [ProjectsService, RequestsService]
})
export class HomeModule {}
