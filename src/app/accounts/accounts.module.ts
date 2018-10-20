import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountsComponent } from './accounts.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ClarityModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [AccountListComponent, AccountFormComponent, AccountsComponent],
  exports: [AccountListComponent, AccountFormComponent, AccountsComponent]
})
export class AccountsModule {}
