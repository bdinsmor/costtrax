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

import { ContactsModule } from '@app/contacts/contacts.module';
import { MailModule } from '@app/mail/mail.module';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { ContactsComponent } from '../contacts/contacts.component';
import { RequestsModule } from '@app/requests/requests.module';
import { ProjectsModule } from '@app/projects/projects.module';

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
    RequestsModule,
    ProjectsModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent],
  entryComponents: [],
  providers: []
})
export class HomeModule {}
