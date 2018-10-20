import { NgModule } from '@angular/core';

import { IfOnDomDirective } from '../../core/directives/if-on-dom/if-on-dom.directive';
import {
  ClickStopPropagationDirective,
} from '../../core/directives/stop-event-propagation/stop-event-propagation.directive';
import { MaterialModule } from '../../material.module';

// tslint:disable-next-line:max-line-length
@NgModule({
  declarations: [IfOnDomDirective, ClickStopPropagationDirective],
  imports: [MaterialModule],
  exports: [IfOnDomDirective, ClickStopPropagationDirective]
})
export class DirectivesModule {}
