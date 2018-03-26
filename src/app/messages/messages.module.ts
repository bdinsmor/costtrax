import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';

import { MessagesService } from './messages.service';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { SharedModule } from '@app/shared';
import { MessagesComponent } from '@app/messages/messages.component';
import { MessageFormComponent } from '@app/messages/message-form/message-form.component';
import { MessageFormDialogComponent } from '@app/messages/message-form-dialog/message-form.dialog.component';
import { MessagesListComponent } from '@app/messages/message-list/messages-list.component';

@NgModule({
  declarations: [MessagesComponent, MessagesListComponent, MessageFormComponent, MessageFormDialogComponent],
  imports: [SharedModule, CdkTableModule, DirectivesModule, PipesModule],
  exports: [MessagesComponent],
  providers: [MessagesService, AppMatchMediaService],
  entryComponents: [MessageFormComponent, MessageFormDialogComponent]
})
export class MessagesModule {}
