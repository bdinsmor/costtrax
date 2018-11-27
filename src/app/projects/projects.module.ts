import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';

import { CoreModule } from '../core';
import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from '../core/directives/ngx-currency/src/currency-mask.config';
import { PipesModule } from '../core/pipes/pipes.module';
import { EquipmentModule } from '../equipment/equipment.module';
import { LaborModule } from '../labor/labor.module';
import { LineItemsModule } from '../line-items/line-items.module';
import { MaterialModule } from '../material.module';
import { ProjectFormDialogComponent } from '../projects/project-form/project-form-dialog.component';
import { ProjectsListComponent } from '../projects/project-list/projects-list.component';
import { RequestsModule } from '../requests/requests.module';
import { SharedModule } from '../shared';
import { UsersModule } from '../users/users.module';
import { ProjectCompleteDialogComponent } from './project-complete-dialog.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectRequestDialogComponent } from './project-request-dialog.component';
import { ProjectsComponent } from './projects.component';

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

registerLocaleData(en);

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsListComponent,
    ProjectFormComponent,
    ProjectRequestDialogComponent,
    ProjectCompleteDialogComponent,
    ProjectFormDialogComponent
  ],
  imports: [
    CoreModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
    RouterModule,
    SharedModule,
    NgxCurrencyModule,
    DirectivesModule,
    EquipmentModule,
    LaborModule,
    LineItemsModule,
    MaterialModule,
    UsersModule,
    RequestsModule,
    ClarityModule,
    ClrFormsNextModule,
    PipesModule
  ],
  exports: [
    ProjectsComponent,
    ProjectsListComponent,
    ProjectRequestDialogComponent,
    ProjectCompleteDialogComponent,
    ProjectFormDialogComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [
    ProjectFormComponent,
    ProjectsListComponent,
    ProjectRequestDialogComponent,
    ProjectCompleteDialogComponent,
    ProjectFormDialogComponent
  ]
})
export class ProjectsModule {}
