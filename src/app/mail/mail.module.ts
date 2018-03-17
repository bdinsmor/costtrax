import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MailComponent } from './mail.component';
import { MailMainSidenavComponent } from './sidenavs/main/main-sidenav.component';
import { MailListItemComponent } from './mail-list/mail-list-item/mail-list-item.component';
import { MailDetailsComponent } from './mail-details/mail-details.component';
import { MailService } from './mail.service';
import { MailComposeDialogComponent } from './dialogs/compose/compose.component';
import { MaterialModule } from '@app/material.module';
import { MailListComponent } from '@app/mail/mail-list/mail-list.component';
import { AuthenticationGuard } from '../core/authentication/authentication.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: 'label/:labelHandle',
    component: MailComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'label/:labelHandle/:mailId',
    component: MailComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'filter/:filterHandle',
    component: MailComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'filter/:filterHandle/:mailId',
    component: MailComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'mail/:folderHandle',
    component: MailComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'mail/:folderHandle/:mailId',
    component: MailComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  declarations: [
    MailComponent,
    MailListComponent,
    MailListItemComponent,
    MailDetailsComponent,
    MailMainSidenavComponent,
    MailComposeDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    MaterialModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [MailComponent],
  providers: [MailService, AuthenticationGuard],
  entryComponents: [MailComposeDialogComponent]
})
export class MailModule {}
