import { NgModule } from '@angular/core';

import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { FilterPipe } from './filter.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { KeysPipe } from './keys.pipe';
import { PhonePipe } from './phone.pipe';
import { RolePipe } from './role.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  declarations: [
    KeysPipe,
    TruncatePipe,
    GetByIdPipe,
    PhonePipe,
    HtmlToPlaintextPipe,
    FilterPipe,
    RolePipe,
    CamelCaseToDashPipe
  ],
  imports: [],
  exports: [
    KeysPipe,
    TruncatePipe,
    GetByIdPipe,
    PhonePipe,
    RolePipe,
    HtmlToPlaintextPipe,
    FilterPipe,
    CamelCaseToDashPipe
  ]
})
export class PipesModule {}
