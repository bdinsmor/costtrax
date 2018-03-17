import { NgModule } from '@angular/core';
import { EntityMetadataMap, NgrxDataModule } from 'ngrx-data';

export const entityMetadata: EntityMetadataMap = {
  Project: {},
  Contacts: {},
  Mails: {},
  Request: {},
  Message: {},
  Activity: {}
};

// because the plural of "hero" is not "heros"
export const pluralNames = {
  Contacts: 'Contacts',
  Mails: 'Mails',
  Project: 'Projects',
  Request: 'Requests',
  Message: 'Messages',
  Activity: 'Activities'
};

@NgModule({
  imports: [NgrxDataModule.forRoot({ entityMetadata: entityMetadata, pluralNames: pluralNames })]
})
export class EntityStoreModule {}
