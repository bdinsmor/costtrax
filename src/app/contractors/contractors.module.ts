import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { ContractorsComponent } from './contractors.component';
import { ContractorsService } from './contractors.service';
import { ContractorFormComponent } from './contractor-form/contractor-form.component';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { SharedModule } from '@app/shared';
import { ContractorsListComponent } from '@app/contractors/contractor-list/contractors-list.component';
import { CompaniesService } from '@app/contractors/companies.service';

const routes: Routes = [
  {
    path: 'contractors',
    component: ContractorsComponent
  }
];

@NgModule({
  declarations: [ContractorsComponent, ContractorFormComponent, ContractorsListComponent],
  imports: [CdkTableModule, SharedModule, DirectivesModule, PipesModule, RouterModule.forChild(routes)],
  exports: [ContractorsComponent],
  providers: [ContractorsService, CompaniesService, AppMatchMediaService],
  entryComponents: [ContractorFormComponent]
})
export class ContractorsModule {}
