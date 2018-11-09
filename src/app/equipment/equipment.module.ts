import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { PipesModule } from '../core/pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { EquipmentSelectComponent } from './equipment-select.component';
import { EquipmentComponent } from './equipment.component';
import { EquipmentService } from './equipment.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    NgxCurrencyModule,
    DirectivesModule,
    PipesModule
  ],
  providers: [EquipmentService],
  declarations: [EquipmentComponent, EquipmentSelectComponent],
  exports: [EquipmentComponent, EquipmentSelectComponent]
})
export class EquipmentModule {}