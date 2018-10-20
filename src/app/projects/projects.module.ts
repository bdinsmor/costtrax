import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';

import { CoreModule } from '../core';
import { BreadcrumbService } from '../core/breadcrumbs/breadcrumbs.service';
import { DirectivesModule } from '../core/directives/directives';
import { NgxCurrencyModule } from '../core/directives/ngx-currency';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from '../core/directives/ngx-currency/src/currency-mask.config';
import { PipesModule } from '../core/pipes/pipes.module';
import { EquipmentModule } from '../equipment/equipment.module';
import { LaborModule } from '../labor/labor.module';
import { LineItemsModule } from '../line-items/line-items.module';
import { ProjectFormDialogComponent } from '../projects/project-form/project-form-dialog.component';
import { ProjectsListComponent } from '../projects/project-list/projects-list.component';
import { RequestsModule } from '../requests/requests.module';
import { SharedModule } from '../shared';
import { UsersModule } from '../users/users.module';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectsComponent } from './projects.component';
import { ProjectsService } from './projects.service';

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
    ProjectsComponent,
    ProjectsListComponent,
    ProjectFormComponent,
    ProjectFormDialogComponent
  ],
  imports: [
    CoreModule,
    BrowserAnimationsModule,
    RouterModule,
    SharedModule,
    NgxCurrencyModule,
    DirectivesModule,
    EquipmentModule,
    LaborModule,
    LineItemsModule,
    UsersModule,
    RequestsModule,
    ClarityModule,
    ClrFormsNextModule,
    PipesModule
  ],
  exports: [
    ProjectsComponent,
    ProjectsListComponent,
    ProjectFormDialogComponent
  ],
  providers: [
    BreadcrumbService,
    ProjectsService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [
    ProjectFormComponent,
    ProjectsListComponent,
    ProjectFormDialogComponent
  ]
})
export class ProjectsModule {}
