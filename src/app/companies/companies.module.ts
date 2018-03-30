import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@app/core/directives/directives';
import { AppMatchMediaService } from '@app/core/services/app-match-media.service';
import { SharedModule } from '@app/shared';
import { ContractorsListComponent } from '@app/contractors/contractor-list/contractors-list.component';
import { CompaniesService } from '@app/companies/companies.service';
import { CompanyFormComponent } from '@app/companies/companies-form/companies-form.component';
import { ContractorsService } from '@app/contractors/contractors.service';
import { ContractorFormComponent } from '@app/contractors/contractor-form/contractor-form.component';
import { CompaniesComponent } from '@app/companies/companies.component';
import { CompaniesListComponent } from '@app/companies/companies-list/companies-list.component';

const routes: Routes = [
  {
    path: 'companies',
    component: CompaniesComponent
  }
];

@NgModule({
  declarations: [CompaniesComponent, CompanyFormComponent, CompaniesListComponent],
  imports: [CdkTableModule, SharedModule, DirectivesModule, PipesModule, RouterModule.forChild(routes)],
  exports: [CompaniesComponent],
  providers: [ContractorsService, CompaniesService, AppMatchMediaService],
  entryComponents: [ContractorFormComponent]
})
export class CompaniesModule {}
