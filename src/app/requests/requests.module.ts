import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '../core';
import { BreadcrumbService } from '../core/breadcrumbs/breadcrumbs.service';
import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from '../core/directives/ngx-currency/src/currency-mask.config';
import { PipesModule } from '../core/pipes/pipes.module';
import { EquipmentService } from '../equipment/equipment.service';
import { LineItemsModule } from '../line-items/line-items.module';
import { ProjectsService } from '../projects/projects.service';
import { SharedModule } from '../shared';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { RequestsComponent } from './requests.component';
import { RequestsService } from './requests.service';

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
  declarations: [RequestsComponent, RequestDetailsComponent],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    DirectivesModule,
    PipesModule,
    LineItemsModule,
    NgxCurrencyModule
  ],
  exports: [RequestDetailsComponent, RequestsComponent],
  providers: [
    BreadcrumbService,
    RequestsService,
    ProjectsService,
    EquipmentService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [RequestsComponent, RequestDetailsComponent]
})
export class RequestsModule {}
