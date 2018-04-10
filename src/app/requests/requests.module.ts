import { EquipmentService } from './equipment.service';
import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';

import { RequestsComponent } from './requests.component';
import { RequestsService } from './requests.service';
import { RequestFormWizardComponent } from './request-form/request-form-wizard.component';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { RequestsListComponent } from '@app/requests/request-list/requests-list.component';
import { RequestFormDialogComponent } from '@app/requests/request-form-dialog/request-form.dialog.component';
import { SharedModule } from '@app/shared';
import { RequestFormComponent } from '@app/requests/request-form/request-form.component';
import { ProjectsService } from '@app/projects/projects.service';
import { NgxDatatableModule, ScrollbarHelper, DimensionsHelper } from '@swimlane/ngx-datatable';
import { NG_SELECT_DEFAULT_CONFIG, NgSelectModule } from '@ng-select/ng-select';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ngx-currency/src/currency-mask.config';

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
    RequestsComponent,
    RequestsListComponent,
    RequestFormComponent,
    RequestFormWizardComponent,
    RequestFormDialogComponent
  ],
  imports: [SharedModule, NgxDatatableModule, CdkTableModule, DirectivesModule, PipesModule, NgxCurrencyModule],
  exports: [RequestsComponent],
  providers: [
    RequestsService,
    ScrollbarHelper,
    DimensionsHelper,
    ProjectsService,
    EquipmentService,
    AppMatchMediaService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [RequestFormComponent, RequestFormDialogComponent]
})
export class RequestsModule {}
