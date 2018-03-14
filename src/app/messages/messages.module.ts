import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesService } from './messages.service';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { MessagesComponent } from './messages.component';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { MessagesRoutingModule } from './messages-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, MessagesRoutingModule],
  exports: [MessagesComponent],
  declarations: [MessagesComponent, MessagesListComponent],
  providers: [MessagesService]
})
export class MessagesModule {}
