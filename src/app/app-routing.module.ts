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
import {TipoNotificacionComponent} from './estrategia/config/tipo-notificacion/tipo-notificacion.component';
import {GestionarTablaMaestroComponent} from './estrategia/mantenimiento/gestionar-tabla-maestro/gestionar-tabla-maestro.component';
import {RolComponent} from './mantenimiento/rol/rol.component';
import {RolCrearComponent} from './mantenimiento/rol/rol-crear.component';
import {RolEditarComponent} from './mantenimiento/rol/rol-editar.component';
import {Autorizacion} from './comun/autorzacion';
import {CanAuthorityGuard} from './guard/can-authority.guard';


const A = Autorizacion;
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
          path: 'seguridad',
          children: [
            {path: 'rol', component: RolComponent },
            {path: 'rol/crear', component: RolCrearComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.ROL_CREAR]}},
            {path: 'rol/editar', component: RolEditarComponent, canActivate: [CanAuthorityGuard] , data: {autorizaciones: [A.ROL_ACTUALIZAR]}},

            {path: 'usuario', component: UsuarioComponent},
            {path: 'usuario/crear', component: UsuarioCrearComponent,  canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.USUARIO_CREAR]}},
            {path: 'usuario/editar', component: UsuarioEditarComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.USUARIO_ACTUALIZAR]}},
            {path: 'usuario/contrasenha', component: UsuarioContrasenhaComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.USUARIO_ACTUALIZAR_CONTRASENHA]}},
          ]
        },
        {
          path: 'mantenimiento',
          children: [
            {path: 'tipo-usuario', component: GestionarTablaMaestroComponent, data: {codTable: 1, title: 'TIPOS DE USUARIO'}},
            {path: 'estado-registro', component: GestionarTablaMaestroComponent, data: {codTable: 2, title: 'ESTADOS DE UN REGISTRO'}},
            {path: 'tipo-moneda', component: GestionarTablaMaestroComponent, data: {codTable: 3, title: 'TIPOS DE MONEDA'}},
            {path: 'condicion-solicitud', component: GestionarTablaMaestroComponent, data: {codTable: 4, title: 'CONDICIÓN DE SOLICITUD'}},
            {path: 'tipo-credito', component: GestionarTablaMaestroComponent, data: {codTable: 5, title: 'TIPO DE CRÉDITO PRE APROBADO'}},
            {path: 'tipo-cobranza', component: GestionarTablaMaestroComponent, data: {codTable: 6, title: 'TIPO DE COBRANZA'}},
            {path: 'tipo-interes', component: GestionarTablaMaestroComponent, data: {codTable: 7, title: 'TIPO DE INTERES'}},
            {path: 'tipo-tasa', component: GestionarTablaMaestroComponent, data: {codTable: 8, title: 'TIPO DE TASA'}},
            {path: 'tipo-direciones', component: GestionarTablaMaestroComponent, data: {codTable: 9, title: 'TABLA TIPO DE DIRECCIÓN'}},
            {path: 'tipo-vivienda', component: GestionarTablaMaestroComponent, data: {codTable: 10, title: 'TABLA TIPO VIVIENDA'}},
            {path: 'tipo-vias', component: GestionarTablaMaestroComponent, data: {codTable: 11, title: 'TABLA TIPO DE VIAS'}},
            {path: 'tipo-secciones', component: GestionarTablaMaestroComponent, data: {codTable: 12, title: 'TABLA TIPO SECCIÓN'}},
            {path: 'tipo-zonas', component: GestionarTablaMaestroComponent, data: {codTable: 13, title: 'TABLA TIPO ZONA'}},
            {path: 'tipo-sectores', component: GestionarTablaMaestroComponent, data: {codTable: 14, title: 'TABLA TIPO SECTOR'}},
            {path: 'uso-telefono', component: GestionarTablaMaestroComponent, data: {codTable: 15, title: 'TABLA TIPO USO TELÉFONO'}},
            {path: 'tipo-operador', component: GestionarTablaMaestroComponent, data: {codTable: 16, title: 'TABLA OPERADOR TELÉFONO'}},
            {path: 'tipo-telefono', component: GestionarTablaMaestroComponent, data: {codTable: 17, title: 'TABLA TIPO DE TELÉFONO'}},
            {path: 'tipo-indicador', component: GestionarTablaMaestroComponent, data: {codTable: 18, title: 'INDICADORES O SUMATORIAS DE CARGA CRÉDITO MANUAL'}},
            {path: 'tipo-documentos', component: GestionarTablaMaestroComponent, data: {codTable: 19, title: 'TABLA DOCUMENTO IDENTIDAD'}},
            {path: 'estados-civil', component: GestionarTablaMaestroComponent, data: {codTable: 21, title: 'TIPO DE GENERO'}},
            {path: 'tipo-genero', component: GestionarTablaMaestroComponent, data: {codTable: 20, title: 'ESTADO CIVIL'}}
          ]
        },
        {
          path: 'estrategia',
          children: [
            {
              path: 'carteras',
              children: [
                {path: '', component: ListarCarteraComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.CARTERA_LISTAR]}},
                {path: 'crear', component: CrearCarteraComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.CARTERA_CREAR]}},
                {path: 'detalle', component: DetalleCarteraComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.CARTERA_ACTUALIZAR]}},
                {path: 'cargar-credito', component: CarteraCargarCreditoComponent},
                {path: 'cargar-credito/socios/:cargaCreditoId', component: CarteraCargarCreditoSociosComponent},
                {path: 'cargar-credito/creditos/:cargaCreditoId', component: CarteraCargarCreditoCreditosComponent},
                {path: 'crear-gestion', component: ActualizarGestionComponent},
                {path: 'editar-gestion', component: ActualizarGestionComponent}
              ]
            },
            {path: 'notificaciones', component: EnviarNotificionComponent,  canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.NOTIFICACION_LISTAR]}}
          ]
        },
        {
          path: 'configuracion',
          children: [
            {
              path: 'notificacion',
              children: [
                {path: '', component: ConfigurarNotificionComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.NOTIFICACION_LISTAR]}},
                {path: 'enviar', component: EnviarNotificionComponent,  canActivate: [CanAuthorityGuard], data: {send: true, autorizaciones: [A.ENVIAR_NOTIFICACION_LISTAR]}}
              ]
            },
            {path: 'tipo-notificacion', component: TipoNotificacionComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_NOTIFICACION_LISTAR]} }
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
