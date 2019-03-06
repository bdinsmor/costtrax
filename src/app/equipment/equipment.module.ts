import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PapaParseModule } from 'ngx-papaparse';

import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { PipesModule } from '../core/pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { EquipmentDeleteDialogComponent } from './equipment-delete-dialog.component';
import { EquipmentSelectComponent } from './equipment-select.component';
import { EquipmentComponent } from './equipment.component';
import { EquipmentUploadDialogComponent } from './upload-equipment-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    NgxCurrencyModule,
    DirectivesModule,
    NgZorroAntdModule,
    PapaParseModule,
    PipesModule
  ],
  declarations: [
    EquipmentComponent,
    EquipmentDeleteDialogComponent,
    EquipmentUploadDialogComponent,
    EquipmentSelectComponent
  ],
  exports: [
    EquipmentComponent,
    EquipmentDeleteDialogComponent,
    EquipmentUploadDialogComponent,
    EquipmentSelectComponent
  ],
  entryComponents: [
    EquipmentUploadDialogComponent,
    EquipmentDeleteDialogComponent
  ]
})
export class EquipmentModule {}
