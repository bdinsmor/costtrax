import { NgModule } from '@angular/core';
import { EntityMetadataMap, NgrxDataModule, DefaultDataServiceConfig } from 'ngrx-data';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'api', // default root path to the server's web api
  // Optionally specify resource URLS for HTTP calls
  entityHttpResourceUrls: {
    // Case matters. Match the case of the entity name.
    // Equipment: {
    // You must specify the root as part of the resource URL.
    //   entityResourceUrl: 'https://external.development.equipmentwatchapi.com/v1/taxonomy/models',
    //  collectionResourceUrl: 'https://external.development.equipmentwatchapi.com/v1/taxonomy/models'
    // }
  }
};

export const entityMetadata: EntityMetadataMap = {
  Company: {},
  Companies: {},
  Message: {},
  Equipment: {},
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
  Equipment: 'Equipment',
  Messages: 'Messages',
  Projects: 'Projects',
  Requests: 'Requests',
  Contractors: 'Contractors',
  LogEntries: 'LogEntries'
};

@NgModule({
  imports: [NgrxDataModule.forRoot({ entityMetadata: entityMetadata, pluralNames: pluralNames })],
  providers: [{ provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }]
})
export class EntityStoreModule {}
