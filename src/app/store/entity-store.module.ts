import { NgModule } from '@angular/core';
import { EntityMetadataMap, NgrxDataModule } from 'ngrx-data';
import { Message } from '../core/in-memory-data.service';

export const entityMetadata: EntityMetadataMap = {
  Project: {},
  Request: {},
  Message: {},
  Activity: {}
};

// because the plural of "hero" is not "heros"
export const pluralNames = { Project: 'Projects', Request: 'Requests', Message: 'Messages', Activity: 'Activities' };

@NgModule({
  imports: [NgrxDataModule.forRoot({ entityMetadata: entityMetadata, pluralNames: pluralNames })]
})
export class EntityStoreModule {}
