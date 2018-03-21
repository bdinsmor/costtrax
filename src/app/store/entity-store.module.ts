import { NgModule } from '@angular/core';
import { EntityMetadataMap, NgrxDataModule } from 'ngrx-data';

export const entityMetadata: EntityMetadataMap = {
  Companies: {},
  Contacts: {},
  Request: {},
  Message: {},
  Activity: {},
  Requests: {},
  Projects: {}
};

// because the plural of "hero" is not "heros"
export const pluralNames = {
  Company: 'Companies',
  Projects: 'Projects',
  Requests: 'Requests',
  Contacts: 'Contacts'
};

@NgModule({
  imports: [NgrxDataModule.forRoot({ entityMetadata: entityMetadata, pluralNames: pluralNames })]
})
export class EntityStoreModule {}
