import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { ContactsMainSidenavComponent } from './sidenavs/main/main.component';
import { ContactsComponent } from './contacts.component';
import { ContactsService } from './contacts.service';
import { ContactsContactListComponent } from './contact-list/contact-list.component';
import { ContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { ContactsContactFormDialogComponent } from './contact-form/contact-form.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatSidenavHelperService } from '@app/core/directives/mat-sidenav/app-mat-sidenav.service';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';

const routes: Routes = [
  {
    path: 'contacts',
    component: ContactsComponent,
    resolve: {
      contacts: ContactsService
    }
  }
];

@NgModule({
  declarations: [
    ContactsComponent,
    ContactsContactListComponent,
    ContactsSelectedBarComponent,
    ContactsMainSidenavComponent,
    ContactsContactFormDialogComponent
  ],
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
  exports: [ContactsComponent],
  providers: [ContactsService, AppMatSidenavHelperService, AppMatchMediaService],
  entryComponents: [ContactsContactFormDialogComponent]
})
export class ContactsModule {}
