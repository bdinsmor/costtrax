import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommentsModule } from '../comments/comments.module';
import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from '../core/directives/ngx-currency/src/currency-mask.config';
import { PipesModule } from '../core/pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { ProjectsService } from '../projects/projects.service';
import { SharedModule } from '../shared';
import { EquipmentModule } from './../equipment/equipment.module';
import { EquipmentService } from './../equipment/equipment.service';
import { LaborService } from './../labor/labor.service';
import { LineItemsComponent } from './line-items.component';

// import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';

/** config angular i18n **/
// registerLocaleData(en);

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  allowZero: true,
  precision: 2,
  prefix: '$ ',
  suffix: '',
  thousands: ',',
  decimal: '.'
};

@NgModule({
  declarations: [LineItemsComponent],
  imports: [
    BrowserAnimationsModule,
    CdkTableModule,
    SharedModule,
    MaterialModule,
    NgxCurrencyModule,
    DirectivesModule,
    PipesModule,
    EquipmentModule,
    CommentsModule
    // NgZorroAntdModule
  ],
  exports: [LineItemsComponent],
  providers: [
    LaborService,
    EquipmentService,
    ProjectsService,
    // { provide: NZ_I18N, useValue: en_US },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [LineItemsComponent]
})
export class LineItemsModule {}
