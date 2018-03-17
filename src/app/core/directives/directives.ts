import { NgModule } from '@angular/core';

import { IfOnDomDirective } from '@app/core/directives/if-on-dom/if-on-dom.directive';
import { PerfectScrollbarDirective } from '@app/core/directives/perfect-scrollbar/perfect-scrollbar.directive';
import { MaterialModule } from '@app/material.module';
import {
  AppMatSidenavHelperDirective,
  AppMatSidenavTogglerDirective
} from '@app/core/directives/mat-sidenav/app-mat-sidenav.directive';

@NgModule({
  declarations: [
    IfOnDomDirective,
    AppMatSidenavHelperDirective,
    AppMatSidenavTogglerDirective,
    PerfectScrollbarDirective
  ],
  imports: [MaterialModule],
  exports: [IfOnDomDirective, AppMatSidenavHelperDirective, AppMatSidenavTogglerDirective, PerfectScrollbarDirective]
})
export class DirectivesModule {}
