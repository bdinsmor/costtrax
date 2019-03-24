import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

import { CoreModule } from '../core';
import { PipesModule } from '../core/pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountDeleteDialogComponent } from './account-list/account-delete-dialog.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountUserFormComponent } from './account-user-form/account-user-form.component';
import { AccountUserDeleteDialogComponent } from './account-user-list/account-user-delete-dialog.component';
import { AccountUserListComponent } from './account-user-list/account-user-list.component';
import { AccountsComponent } from './accounts.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CoreModule,
    ClarityModule,
    PipesModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [
    AccountListComponent,
    AccountUserListComponent,
    AccountUserFormComponent,
    AccountUserDeleteDialogComponent,
    AccountDeleteDialogComponent,
    AccountDetailsComponent,
    AccountFormComponent,
    AccountsComponent
  ],
  exports: [
    AccountListComponent,
    AccountFormComponent,
    AccountUserFormComponent,
    AccountUserListComponent,
    AccountUserDeleteDialogComponent,
    AccountDeleteDialogComponent,
    AccountDetailsComponent,
    AccountsComponent
  ],
  entryComponents: [
    AccountFormComponent,
    AccountUserFormComponent,
    AccountDetailsComponent,
    AccountUserDeleteDialogComponent,
    AccountDeleteDialogComponent
  ]
})
export class AccountsModule {}
