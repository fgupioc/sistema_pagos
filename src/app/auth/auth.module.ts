import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
    AppBreadcrumbModule,
  ]
})
export class AuthModule {
}
