import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountDetailsComponent } from './accounts/account-details/account-details.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AuthenticationGuard } from './core';
import { DeactivateGuard } from './core/authentication/can-deactivate.guard';
import { UberAdminGuard } from './core/authentication/uberAdmin.guard';
import { EquipmentComponent } from './equipment/equipment.component';
import { HomeComponent } from './home/home.component';
import { LaborComponent } from './labor/labor.component';
import { ProjectFormComponent } from './projects/project-form/project-form.component';
import { ProjectsComponent } from './projects/projects.component';
import { RequestDetailsComponent } from './requests/request-details/request-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
    data: {
      animation: 'home'
    }
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthenticationGuard],
    data: {
      animation: 'projects'
    }
  },
  {
    path: 'projects/:id',
    component: ProjectFormComponent,
    canActivate: [AuthenticationGuard],
    data: {
      animation: 'details'
    }
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [AuthenticationGuard, UberAdminGuard],
    data: {
      animation: 'accounts'
    }
  },
  {
    path: 'accounts/:id',
    component: AccountDetailsComponent,
    canActivate: [AuthenticationGuard, UberAdminGuard],
    data: {
      animation: 'details'
    }
  },
  {
    path: 'equipment',
    component: EquipmentComponent,
    canActivate: [AuthenticationGuard],
    data: {
      animation: 'details'
    }
  },
  {
    path: 'labor',
    component: LaborComponent,
    canActivate: [AuthenticationGuard],
    data: {
      animation: 'details'
    }
  },
  {
    path: 'requests',
    component: RequestDetailsComponent,
    canActivate: [AuthenticationGuard],
    data: {
      animation: 'details'
    }
  },
  {
    path: 'requests/:id',
    component: RequestDetailsComponent,
    canActivate: [AuthenticationGuard],
    canDeactivate: [DeactivateGuard],
    data: {
      animation: 'details'
    }
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',

    data: { animation: 'reload' }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
