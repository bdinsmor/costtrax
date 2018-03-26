import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Route } from '@app/core';
import { HomeComponent } from './home/home.component';
import { RequestsComponent } from './requests/requests.component';
import { ProjectsComponent } from '@app/projects/projects.component';
import { ContractorsComponent } from '@app/contractors/contractors.component';
import { RequestFormComponent } from '@app/requests/request-form/request-form.component';
import { ProjectFormDialogComponent } from '@app/projects/project-form/project-form.component';
import { ContractorFormComponent } from '@app/contractors/contractor-form/contractor-form.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  Route.withShell([
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    { path: 'home', component: HomeComponent },
    { path: 'requests', component: RequestsComponent },
    { path: 'requests/:id', component: RequestFormComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'projects/:id', component: ProjectFormDialogComponent },
    { path: 'messages', component: MessagesComponent },
    { path: 'contractors', component: ContractorsComponent },
    { path: 'contractors/id', component: ContractorFormComponent }
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
