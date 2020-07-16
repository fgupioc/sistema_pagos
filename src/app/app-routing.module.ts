import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsuarioComponent} from './mantenimiento/usuario/usuario.component';
import {AuthComponent} from './auth/auth.component';
import {UsuarioEditarComponent} from './mantenimiento/usuario/editar/editar.component';
import {UsuarioCrearComponent} from './mantenimiento/usuario/crear/crear.component';
import {UsuarioContrasenhaComponent} from './mantenimiento/usuario/contrasenha/contrasenha.component';
import {CrearCarteraComponent} from './estrategia/cartera/crear-cartera/crear-cartera.component';
import {ActualizarGestionComponent} from './estrategia/gestion/actualizar-gestion/actualizar-gestion.component';
import {CarteraCargarCreditoComponent} from './estrategia/cartera/cargar-credito/cargar-credito.component';
import {ConfigurarNotificionComponent} from './estrategia/configuracion/configurar-notificion/configurar-notificion.component';
import {EnviarNotificionComponent} from './estrategia/configuracion/enviar-notificion/enviar-notificion.component';
import {CarteraCargarCreditoCreditosComponent} from './estrategia/cartera/cargar-credito/creditos/creditos.component';
import {ListaSociosComponent} from './componentes/socio/lista-socios/lista-socios.component';
import {EditarSociosComponent} from './componentes/socio/editar-socios/editar-socios.component';
import {CarteraCargarCreditoSociosComponent} from './estrategia/cartera/cargar-credito/socios/socios.component';
import {LoginComponent} from './publico/login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GuestGuard} from './guard/guest.guard';
import {AuthGuard} from './guard/auth.guard';
import {ValidarPinComponent} from './publico/validar-pin/validar-pin.component';
import {DetalleCarteraComponent} from './estrategia/cartera/detalle-cartera/detalle-cartera.component';
import {ListarCarteraComponent} from './estrategia/cartera/listar-cartera/listar-cartera.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
  {path: 'restablecimiento-credenciales', component: ValidarPinComponent, canActivate: [GuestGuard]},
  {
    path: 'auth', children: [{
      path: '', component: AuthComponent,
      children: [
        {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
        {
          path: 'mantenimiento',
          children: [
            {path: 'usuario', component: UsuarioComponent},
            {path: 'usuario/crear', component: UsuarioCrearComponent},
            {path: 'usuario/editar', component: UsuarioEditarComponent},
            {path: 'usuario/contrasenha', component: UsuarioContrasenhaComponent},
          ]
        },
        {
          path: 'estrategia',
          children: [
            {
              path: 'carteras',
              children: [
                {path: '', component: ListarCarteraComponent},
                {path: 'crear', component: CrearCarteraComponent},
                {path: 'detalle', component: DetalleCarteraComponent},
                {path: 'cargar-credito', component: CarteraCargarCreditoComponent},
                {path: 'cargar-credito/socios/:cargaCreditoId', component: CarteraCargarCreditoSociosComponent},
                {path: 'cargar-credito/creditos/:cargaCreditoId', component: CarteraCargarCreditoCreditosComponent},
                {path: 'crear-gestion', component: ActualizarGestionComponent},
                {path: 'editar-gestion', component: ActualizarGestionComponent}
              ]
            },
            {path: 'notificaciones', component: EnviarNotificionComponent}
          ]
        },
        {
          path: 'configuracion',
          children: [
            {
              path: 'notificacion',
              children: [
                {path: '', component: ConfigurarNotificionComponent},
                {path: 'enviar', component: EnviarNotificionComponent, data: {send: true}}
              ]
            },
          ]
        },
        {
          path: 'socio',
          children: [
            {path: 'lista-socios', component: ListaSociosComponent},
            {path: 'detalle', component: EditarSociosComponent}
          ]
        }
      ]
    }], canActivate: [AuthGuard]
  },
  {path: '**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
