import { CdkTableModule } from '@angular/cdk/table';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CommentsModule } from '../comments/comments.module';
import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from '../core/directives/ngx-currency/src/currency-mask.config';
import { PipesModule } from '../core/pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared';
import { EquipmentModule } from './../equipment/equipment.module';
import { AddMiscDialogComponent } from './dialogs/add-misc-dialog.component';
import { AddSavedDialogComponent } from './dialogs/add-saved-dialog.component';
import { ConfigurationDialogComponent } from './dialogs/configuration-dialog.component';
import { LineItemApproveDialogComponent } from './dialogs/line-item-approve-dialog.component';
import { LineItemDeleteDialogComponent } from './dialogs/line-item-delete-dialog.component';
import { LineItemMailDialogComponent } from './dialogs/mail-dialog.component';
import { LineItemsComponent } from './line-items.component';

/** config angular i18n **/
registerLocaleData(en);

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
  declarations: [
    LineItemsComponent,
    LineItemDeleteDialogComponent,
    AddSavedDialogComponent,
    AddMiscDialogComponent,
    LineItemMailDialogComponent,
    ConfigurationDialogComponent,
    LineItemApproveDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CdkTableModule,
    SharedModule,
    MaterialModule,
    NgxCurrencyModule,
    DirectivesModule,
    PipesModule,
    EquipmentModule,
    CommentsModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [
    LineItemsComponent,
    AddSavedDialogComponent,
    LineItemMailDialogComponent,
    LineItemDeleteDialogComponent,
    AddMiscDialogComponent,
    ConfigurationDialogComponent,
    LineItemApproveDialogComponent
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [
    LineItemsComponent,
    LineItemMailDialogComponent,
    LineItemDeleteDialogComponent,
    AddSavedDialogComponent,
    AddMiscDialogComponent,
    ConfigurationDialogComponent,
    LineItemApproveDialogComponent
  ]
})
export class LineItemsModule {}
