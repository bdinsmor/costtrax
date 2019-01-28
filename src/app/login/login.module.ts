import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';

import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ResetComponent } from './reset/reset.component';
import { SyncDialogComponent } from './sync.dialog';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    CountdownModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent, SyncDialogComponent, ResetComponent],
  entryComponents: [SyncDialogComponent]
})
export class LoginModule {}
