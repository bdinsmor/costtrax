import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { TextMaskModule } from 'angular2-text-mask';

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
import { ProjectsModule } from './projects/projects.module';
import { RequestsModule } from './requests/requests.module';
import { SharedModule } from './shared';

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
    AppRoutingModule,
    EquipmentModule,
    LaborModule,
    ClarityModule,
    ClrFormsNextModule,
    MaterialModule,
    AppRoutingModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
