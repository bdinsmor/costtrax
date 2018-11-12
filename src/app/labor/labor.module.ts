import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { PipesModule } from '../core/pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { LaborDeleteDialogComponent } from './labor-delete-dialog.component';
import { LaborComponent } from './labor.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CdkTableModule,
    SharedModule,
    MaterialModule,
    NgxCurrencyModule,
    DirectivesModule,
    PipesModule
  ],
  declarations: [LaborComponent, LaborDeleteDialogComponent],
  exports: [LaborComponent, LaborDeleteDialogComponent],
  entryComponents: [LaborDeleteDialogComponent]
})
export class LaborModule {}
