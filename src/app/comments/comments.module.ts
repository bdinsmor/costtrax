import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClarityModule, ClrFormsNextModule } from '../../../node_modules/@clr/angular';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { CommentsComponent } from './comments.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    SharedModule,
    ClrFormsNextModule,
    MaterialModule
  ],
  declarations: [CommentsComponent],
  exports: [CommentsComponent]
})
export class CommentsModule {}
