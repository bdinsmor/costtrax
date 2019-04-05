import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from '../material.module';
import { UsersModule } from '../users/users.module';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [
    FormsModule,
    NgSelectModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    ClarityModule,
    CommonModule,
    UsersModule
  ],
  declarations: [ConfirmDialogComponent, LoaderComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
    ClarityModule,
    NgSelectModule,
    ConfirmDialogComponent,
    LoaderComponent
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule {}
