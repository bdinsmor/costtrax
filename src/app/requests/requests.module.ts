import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FileSaverModule } from 'ngx-filesaver';

import { CoreModule } from '../core';
import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from '../core/directives/ngx-currency/src/currency-mask.config';
import { PipesModule } from '../core/pipes/pipes.module';
import { LineItemsModule } from '../line-items/line-items.module';
import { SharedModule } from '../shared';
import { RequestApproveDialogComponent } from './dialogs/request-approve-dialog.component';
import { RequestCloneDialogComponent } from './dialogs/request-clone-dialog.component';
import { RequestDeleteDialogComponent } from './dialogs/request-delete-dialog.component';
import { RequestRecapitulationDialogComponent } from './dialogs/request-recapitulation-dialog.component';
import { RequestRejectDialogComponent } from './dialogs/request-reject-dialog.component';
import { RequestReworkDialogComponent } from './dialogs/request-rework-dialog.component';
import { RequestSubmitDialogComponent } from './dialogs/request-submit-dialog.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { RequestsComponent } from './requests.component';

'';
// import HeadroomModule
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  allowZero: true,
  precision: 2,
  prefix: '$ ',
  suffix: '',
  thousands: ',',
  decimal: '.'
};

/** config angular i18n **/
registerLocaleData(en);

@NgModule({
  declarations: [
    RequestsComponent,
    RequestCloneDialogComponent,
    RequestSubmitDialogComponent,
    RequestRejectDialogComponent,
    RequestApproveDialogComponent,
    RequestReworkDialogComponent,
    RequestDeleteDialogComponent,
    RequestRecapitulationDialogComponent,
    RequestDetailsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    DirectivesModule,
    PipesModule,
    NgZorroAntdModule,
    LineItemsModule,
    NgxCurrencyModule,
    FileSaverModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [
    RequestDetailsComponent,
    RequestCloneDialogComponent,
    RequestSubmitDialogComponent,
    RequestRejectDialogComponent,
    RequestReworkDialogComponent,
    RequestApproveDialogComponent,
    RequestDeleteDialogComponent,
    RequestRecapitulationDialogComponent,
    RequestsComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [
    RequestsComponent,
    RequestRecapitulationDialogComponent,
    RequestCloneDialogComponent,
    RequestSubmitDialogComponent,
    RequestRejectDialogComponent,
    RequestReworkDialogComponent,
    RequestApproveDialogComponent,
    RequestDeleteDialogComponent,
    RequestDetailsComponent
  ]
})
export class RequestsModule {}
