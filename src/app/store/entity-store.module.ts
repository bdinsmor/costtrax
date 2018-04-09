import { NgModule } from '@angular/core';
import { EntityMetadataMap, NgrxDataModule } from 'ngrx-data';

export const entityMetadata: EntityMetadataMap = {
  Company: {},
  Companies: {},
  Message: {},
  Machines: {},
  Messages: {},
  Contractor: {},
  Contractors: {},
  Requests: {},
  Projects: {},
  LogEntries: {}
};

// because the plural of "hero" is not "heros"
export const pluralNames = {
  Company: 'Companies',
  Companies: 'Companies',
  Machine: 'Machines',
  Machines: 'Machines',
  Messages: 'Messages',
  Projects: 'Projects',
  Requests: 'Requests',
  Contractors: 'Contractors',
  LogEntries: 'LogEntries'
};

@NgModule({
  imports: [NgrxDataModule.forRoot({ entityMetadata: entityMetadata, pluralNames: pluralNames })]
})
export class EntityStoreModule {}
