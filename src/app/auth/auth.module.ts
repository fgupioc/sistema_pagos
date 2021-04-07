import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BsDropdownModule, TabsModule} from 'ngx-bootstrap';
import {AppRoutingModule} from '../app-routing.module';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {MantenimientoModule} from '../mantenimiento/mantenimiento.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ComponentesModule} from '../componentes/componentes.module';
import { RecuperacionModule } from '../recuperacion/recuperacion.module';

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
        NgxSpinnerModule,
        ComponentesModule,
        RecuperacionModule
    ]
})
export class AuthModule {
}
