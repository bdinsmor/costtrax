import { NgModule } from '@angular/core';

import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { DatesPipe } from './dates.pipe';
import { FilterPipe } from './filter.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { KeysPipe } from './keys.pipe';
import { RolePipe } from './role.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  declarations: [
    KeysPipe,
    TruncatePipe,
    GetByIdPipe,
    HtmlToPlaintextPipe,
    FilterPipe,
    RolePipe,
    DatesPipe,
    CamelCaseToDashPipe
  ],
  imports: [],
  exports: [
    KeysPipe,
    DatesPipe,
    TruncatePipe,
    GetByIdPipe,
    RolePipe,
    HtmlToPlaintextPipe,
    FilterPipe,
    CamelCaseToDashPipe
  ]
})
export class PipesModule {}
