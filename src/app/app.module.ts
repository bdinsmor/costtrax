import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ClarityModule } from '@clr/angular';
import { TextMaskModule } from 'angular2-text-mask';

import { environment } from '../environments/environment';
import { AccountsModule } from './accounts/accounts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { DirectivesModule } from './core/directives/directives';
import { EquipmentModule } from './equipment/equipment.module';
import { HomeModule } from './home/home.module';
import { LaborModule } from './labor/labor.module';
import { LineItemsModule } from './line-items/line-items.module';
import { LoginModule } from './login/login.module';
import { MaterialModule } from './material.module';
import { ProjectFormDialogComponent } from './projects/project-form/project-form-dialog.component';
import { ProjectsModule } from './projects/projects.module';
import { RequestsModule } from './requests/requests.module';
import { SharedModule } from './shared';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';

/** config angular i18n **/
registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    DirectivesModule,
    LoginModule,
    HomeModule,
    TextMaskModule,
    RequestsModule,
    LineItemsModule,
    ProjectsModule,
    AccountsModule,
    AppRoutingModule,
    EquipmentModule,
    LaborModule,
    ClarityModule,
    MaterialModule,
    NgZorroAntdModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  entryComponents: [ProjectFormDialogComponent],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule {}
