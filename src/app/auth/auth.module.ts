import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BsDropdownModule, TabsModule} from 'ngx-bootstrap';
import {AppRoutingModule} from '../app-routing.module';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {MantenimientoModule} from '../mantenimiento/mantenimiento.module';

@NgModule({
  declarations: [AuthComponent, DashboardComponent],
  imports: [
    CommonModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
    AppBreadcrumbModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    AppRoutingModule,
    MantenimientoModule,
  ]
})
export class AuthModule {
}
