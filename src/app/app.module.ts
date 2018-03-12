import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { RequestsComponent } from './requests/requests.component';
import { ProjectDetailsDialogComponent } from '@app/project-details/project-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    HomeModule,
    LoginModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MessagesComponent,
    ProjectsComponent,
    ProjectDetailsDialogComponent,
    ProjectDetailsComponent,
    RequestsComponent
  ],
  entryComponents: [ProjectDetailsDialogComponent],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
