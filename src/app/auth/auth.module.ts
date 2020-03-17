import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BsDropdownModule, TabsModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
    AppBreadcrumbModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ]
})
export class AuthModule {
}
