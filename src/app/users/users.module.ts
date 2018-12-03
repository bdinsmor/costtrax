import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

import { PipesModule } from '../core/pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDialogComponent } from './user-list/user-dialog.component';
import { UserListComponent } from './user-list/user-list.component';
import { UsersComponent } from './users.component';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ClarityModule,
    PipesModule,
    NgZorroAntdModule,
    MaterialModule
  ],
  declarations: [
    UserListComponent,
    UserDialogComponent,
    UserFormComponent,
    UsersComponent
  ],
  exports: [
    UserListComponent,
    UserFormComponent,
    UserDialogComponent,
    UsersComponent
  ],
  entryComponents: [UserFormComponent, UserDialogComponent]
})
export class UsersModule {}
