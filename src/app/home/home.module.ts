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
import { MessagesComponent } from '@app/messages/messages.component';
import { RequestsComponent } from '@app/requests/requests.component';
import { ProjectsComponent } from '@app/projects/projects.component';
import { ProjectDetailsDialogComponent } from '@app/project-details/project-dialog.component';
import { ProjectDetailsComponent } from '@app/project-details/project-details.component';
import { MessagesService } from '@app/messages/messages.service';
import { ProjectsService } from '../projects/projects.service';
import { RequestsService } from '../requests/requests.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    MessagesComponent,
    ProjectsComponent,
    ProjectDetailsDialogComponent,
    ProjectDetailsComponent,
    RequestsComponent
  ],
  entryComponents: [ProjectDetailsDialogComponent],
  providers: [MessagesService, ProjectsService, RequestsService]
})
export class HomeModule {}
