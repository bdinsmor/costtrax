import { NgModule } from '@angular/core';
import { EntityMetadataMap, NgrxDataModule } from 'ngrx-data';

export const entityMetadata: EntityMetadataMap = {
  Companies: {},
  Contacts: {},
  Requests: {},
  Activity: {},
  Projects: {},
  LogEntries: {}
};

// because the plural of "hero" is not "heros"
export const pluralNames = {
  Company: 'Companies',
  Projects: 'Projects',
  Requests: 'Requests',
  Activity: 'Activity',
  Contacts: 'Contacts',
  LogEntries: 'LogEntries'
};

@NgModule({
  imports: [NgrxDataModule.forRoot({ entityMetadata: entityMetadata, pluralNames: pluralNames })]
})
export class EntityStoreModule {}
