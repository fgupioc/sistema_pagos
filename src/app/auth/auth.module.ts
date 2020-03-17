import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
    AppBreadcrumbModule,
    PerfectScrollbarModule,
  ]
})
export class AuthModule {
}
