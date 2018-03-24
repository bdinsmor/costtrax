import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Route } from '@app/core';

const routes: Routes = [
  Route.withShell([
    { path: 'requests', loadChildren: 'app/requests/requests.module#RequestsModule' },
    { path: 'about', loadChildren: 'app/about/about.module#AboutModule' }
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
