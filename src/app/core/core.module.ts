import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { TokenInterceptor } from '../core/http/http-token.interceptor';
import { PipesModule } from '../core/pipes/pipes.module';
import { ToolbarNotificationsComponent } from '../core/toolbar-notifications/toolbar-notifications.component';
import { ToolbarUserButtonComponent } from '../core/toolbar-user-button/toolbar-user-button.component';
import { UtilsModule } from '../core/utils/utils.module';
import { MaterialModule } from '../material.module';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationService } from './authentication/authentication.service';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { BreadcrumbService } from './breadcrumbs/breadcrumbs.service';
import { HeaderComponent } from './header/header.component';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { RequestCacheService } from './http/http-cache.service';
import { HttpService } from './http/http.service';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { ShellComponent } from './shell/shell.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    PipesModule,
    MaterialModule,
    UtilsModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    ToolbarNotificationsComponent,
    ToolbarUserButtonComponent,
    BreadcrumbsComponent,
    ShellComponent
  ],
  exports: [
    ToolbarNotificationsComponent,
    ToolbarUserButtonComponent,
    BreadcrumbsComponent
  ],

  providers: [
    AuthenticationService,
    AuthenticationGuard,
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
