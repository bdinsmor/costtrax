import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    TranslateModule.forRoot(),
    AppStoreModule,
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    LoginModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [LogEntryService, MessagesService, RequestsService, ProjectsService, ContractorsService, CompaniesService],
  bootstrap: [AppComponent]
})
export class AppModule {}
