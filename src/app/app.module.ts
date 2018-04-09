import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { MaterialModule } from './material.module';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from './store/app-store.module';
import { LogEntryService } from '@app/home/home.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RequestsService } from '@app/requests/requests.service';
import { ProjectsService } from '@app/projects/projects.service';
import { ContractorsService } from '@app/contractors/contractors.service';
import { MessagesService } from './messages/messages.service';
import { CompaniesService } from '@app/companies/companies.service';
import { RequestFormWizardComponent } from '@app/requests/request-form/request-form-wizard.component';

import { NG_SELECT_DEFAULT_CONFIG, NgSelectModule } from '@ng-select/ng-select';
import { EquipmentService } from '@app/requests/equipment.service';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3001'],
        blacklistedRoutes: ['localhost:3001/auth/']
      }
    }),
    FlexLayoutModule,
    TranslateModule.forRoot(),
    AppStoreModule,
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    LoginModule,
    NgSelectModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  entryComponents: [RequestFormWizardComponent],
  providers: [
    LogEntryService,
    MessagesService,
    EquipmentService,
    RequestsService,
    ProjectsService,
    ContractorsService,
    CompaniesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
