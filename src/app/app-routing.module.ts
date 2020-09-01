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
import {AsignacionCarteraComponent} from './estrategia/asignacion-cartera/asignacion-cartera.component';
import {AsignarEtapasEjecutivoComponent} from './estrategia/asignacion-cartera/asignar-etapas-ejecutivo/asignar-etapas-ejecutivo.component';
import {EjecutivoCreditosComponent} from './estrategia/asignacion-cartera/ejecutivo-creditos/ejecutivo-creditos.component';
import {CreditoSocioComponent} from './estrategia/asignacion-cartera/credito-socio/credito-socio.component';
import {EjecutivoAsignacionesComponent} from './estrategia/asignacion-cartera/ejecutivo-asignaciones/ejecutivo-asignaciones.component';


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
            {path: 'rol', component: RolComponent},
            {path: 'rol/crear', component: RolCrearComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.ROL_CREAR]}},
            {path: 'rol/editar', component: RolEditarComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.ROL_ACTUALIZAR]}},

            {path: 'usuario', component: UsuarioComponent},
            {path: 'usuario/crear', component: UsuarioCrearComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.USUARIO_CREAR]}},
            {path: 'usuario/editar', component: UsuarioEditarComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.USUARIO_ACTUALIZAR]}},
            {path: 'usuario/contrasenha', component: UsuarioContrasenhaComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.USUARIO_ACTUALIZAR_CONTRASENHA]}},
          ]
        },
        {
          path: 'mantenimiento',
          children: [
            {path: 'tipo-usuario', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_USUARIO_LISTAR], codTable: 1, title: 'TIPOS DE USUARIO', code: A.TIPO_USUARIO_CODE}},
            {path: 'estado-registro', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.ESTADO_REGISTRO_LISTAR], codTable: 2, title: 'ESTADOS DE UN REGISTRO', code: A.ESTADO_REGISTRO_CODE}},
            {path: 'tipo-moneda', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_MONEDA_LISTAR], codTable: 3, title: 'TIPOS DE MONEDA', code: A.TIPO_MONEDA_CODE}},
            {path: 'condicion-solicitud', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.CONDICION_SOLICITUD_LISTAR], codTable: 4, title: 'CONDICIÓN DE SOLICITUD', code: A.CONDICION_SOLICITUD_CODE}},
            {path: 'tipo-credito', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_CREDITO_LISTAR], codTable: 5, title: 'TIPO DE CRÉDITO PRE APROBADO', code: A.TIPO_CREDITO_CODE}},
            {path: 'tipo-cobranza', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_COBRANZA_LISTAR], codTable: 6, title: 'TIPO DE COBRANZA', code: A.TIPO_COBRANZA_CODE}},
            {path: 'tipo-interes', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_INTERES_LISTAR], codTable: 7, title: 'TIPO DE INTERES', code: A.TIPO_COBRANZA_CODE}},
            {path: 'tipo-tasa', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_TASA_LISTAR], codTable: 8, title: 'TIPO DE TASA', code: A.TIPO_TASA_CODE}},
            {path: 'tipo-direciones', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_DIRECCION_LISTAR], codTable: 9, title: 'TABLA TIPO DE DIRECCIÓN', code: A.TIPO_DIRECCION_CODE}},
            {path: 'tipo-vivienda', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_VIVIENDA_LISTAR], codTable: 10, title: 'TABLA TIPO VIVIENDA', code: A.TIPO_VIVIENDA_CODE}},
            {path: 'tipo-vias', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_VIAS_LISTAR], codTable: 11, title: 'TABLA TIPO DE VIAS', code: A.TIPO_VIAS_CODE}},
            {path: 'tipo-secciones', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_SECCION_LISTAR], codTable: 12, title: 'TABLA TIPO SECCIÓN', code: A.TIPO_SECCION_CODE}},
            {path: 'tipo-zonas', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_ZONAS_LISTAR], codTable: 13, title: 'TABLA TIPO ZONA', code: A.TIPO_ZONAS_CODE}},
            {path: 'tipo-sectores', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_SECTORES_LISTAR], codTable: 14, title: 'TABLA TIPO SECTOR', code: A.TIPO_SECTORES_CODE}},
            {path: 'uso-telefono', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_USO_TELEFONO_LISTAR], codTable: 15, title: 'TABLA TIPO USO TELÉFONO', code: A.TIPO_USO_TELEFONO_CODE}},
            {path: 'tipo-operador', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_OPERADOR_LISTAR], codTable: 16, title: 'TABLA OPERADOR TELÉFONO', code: A.TIPO_OPERADOR_CODE}},
            {path: 'tipo-telefono', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_TELEFONO_LISTAR], codTable: 17, title: 'TABLA TIPO DE TELÉFONO', code: A.TIPO_TELEFONO_CODE}},
            {path: 'tipo-indicador', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_INDICADORES_LISTAR], codTable: 18, title: 'INDICADORES O SUMATORIAS DE CARGA CRÉDITO MANUAL', code: A.TIPO_CREDITO_CODE}},
            {path: 'tipo-documentos', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_DOCUMENTOS_LISTAR], codTable: 19, title: 'TABLA DOCUMENTO IDENTIDAD', code: A.TIPO_DOCUMENTOS_CODE}},
            {path: 'estados-civil', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_GENERO_LISTAR], codTable: 21, title: 'TIPO DE GENERO', code: A.TIPO_GENERO_CODE}},
            {path: 'tipo-genero', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.ESTADO_CIVIL_LISTAR], codTable: 20, title: 'ESTADO CIVIL', code: A.ESTADO_CIVIL_CODE}},
            {path: 'lista-sedes', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.LISTA_SEDES_LISTAR], codTable: 22, title: 'LISTA DE SEDES', code: A.LISTA_SEDES_CODE}},
            {path: 'destino-credito', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.DESTINO_CREDITO_LISTAR], codTable: 23, title: 'DESTINO CREDITO', code: A.DESTINO_CREDITO_CODE}}
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
                {path: 'editar-gestion', component: ActualizarGestionComponent},
                /*
                {path: ':nombre/asignacion', component: AsignacionCarteraComponent},
                {path: ':nombre/asignacion/:ejecutivoId/etapas', component: AsignarEtapasEjecutivoComponent},
                {path: ':nombre/asignacion/:ejecutivoId/creditos', component: EjecutivoCreditosComponent},
                {path: ':nombre/asignacion/:ejecutivoId/creditos/socio', component: CreditoSocioComponent}
                 */
              ]
            },
            {path: 'notificaciones', component: EnviarNotificionComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.NOTIFICACION_LISTAR]}},
            {path: 'asignacion-cartera', component: AsignacionCarteraComponent},
            {path: 'asignacion-cartera/:ejecutivoId/configuracion', component: AsignarEtapasEjecutivoComponent},
            {path: 'asignacion-cartera/:ejecutivoId/listado', component: EjecutivoAsignacionesComponent},
          ]
        },
        {
          path: 'configuracion',
          children: [
            {
              path: 'notificacion',
              children: [
                {path: '', component: ConfigurarNotificionComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.NOTIFICACION_LISTAR]}},
                {path: 'enviar', component: EnviarNotificionComponent, canActivate: [CanAuthorityGuard], data: {send: true, autorizaciones: [A.ENVIAR_NOTIFICACION_LISTAR]}}
              ]
            },
            {path: 'tipo-notificacion', component: TipoNotificacionComponent, canActivate: [CanAuthorityGuard], data: {autorizaciones: [A.TIPO_NOTIFICACION_LISTAR]}}
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
