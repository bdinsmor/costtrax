import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { TokenInterceptor } from '../core/http/http-token.interceptor';
import { ToolbarUserButtonComponent } from '../core/toolbar-user-button/toolbar-user-button.component';
import { MaterialModule } from '../material.module';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { UberAdminGuard } from './authentication/uberAdmin.guard';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { BreadcrumbService } from './breadcrumbs/breadcrumbs.service';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { RequestCacheService } from './http/http-cache.service';
import { HttpService } from './http/http.service';
import { PipesModule } from './pipes/pipes.module';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { UtilsModule } from './utils/utils.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    ClarityModule,
    PipesModule,
    MaterialModule,
    UtilsModule,
    RouterModule
  ],
  declarations: [ToolbarUserButtonComponent, BreadcrumbsComponent],
  exports: [ToolbarUserButtonComponent, BreadcrumbsComponent],

  providers: [
    AuthenticationGuard,
    UberAdminGuard,
    BreadcrumbService,
    RequestCacheService,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    // Import guard
    if (parentModule) {
      throw new Error(
        `${parentModule} has already been loaded. Import Core module in the AppModule only.`
      );
    }
  }
}
