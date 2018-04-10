import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { FilterPipe } from './filter.pipe';
import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { PhonePipe } from '@app/core/pipes/phone.pipe';
import { TruncatePipe } from '@app/core/pipes/truncate.pipe';

@NgModule({
  declarations: [KeysPipe, TruncatePipe, GetByIdPipe, PhonePipe, HtmlToPlaintextPipe, FilterPipe, CamelCaseToDashPipe],
  imports: [],
  exports: [KeysPipe, TruncatePipe, GetByIdPipe, PhonePipe, HtmlToPlaintextPipe, FilterPipe, CamelCaseToDashPipe]
})
export class PipesModule {}
