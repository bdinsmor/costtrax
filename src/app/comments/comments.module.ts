import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClarityModule } from '../../../node_modules/@clr/angular';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { CommentsComponent } from './comments.component';

@NgModule({
  imports: [CommonModule, ClarityModule, SharedModule, MaterialModule],
  declarations: [CommentsComponent],
  exports: [CommentsComponent]
})
export class CommentsModule {}
