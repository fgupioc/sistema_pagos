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
import {MisCarterasAsignadasComponent} from './estrategia/asignacion-cartera/mis-carteras-asignadas/mis-carteras-asignadas.component';
import {EjecutivoTareaComponent} from './estrategia/gestionar-tarea/ejecutivo-tarea/ejecutivo-tarea.component';
import {TableroTareasComponent} from './estrategia/gestionar-tarea/tablero-tareas/tablero-tareas.component';
import {TareaDetalleComponent} from './estrategia/gestionar-tarea/tarea-detalle/tarea-detalle.component';
import {MisGestionesComponent} from './estrategia/ejecutivo/mis-gestiones/mis-gestiones.component';
import {MisGestionesDetalleComponent} from './estrategia/ejecutivo/mis-gestiones-detalle/mis-gestiones-detalle.component';
import {SocioCreditosComponent} from './socio/views/socio-creditos/socio-creditos.component';
import {SocioCreditoDetalleComponent} from './socio/views/socio-credito-detalle/socio-credito-detalle.component';
import {SupervisorAsignacionesComponent} from './estrategia/asignacion-cartera/supervisor-asignaciones/supervisor-asignaciones.component';
import {SupervisorCreditosComponent} from './estrategia/asignacion-cartera/supervisor-creditos/supervisor-creditos.component';
import {SupervisorCreditoSocioComponent} from './estrategia/asignacion-cartera/supervisor-credito-socio/supervisor-credito-socio.component';
import {BitacoraGestionesComponent} from './estrategia/reportes/bitacora-gestiones/bitacora-gestiones.component';
import {RelacionGestionesRealizadasComponent} from './estrategia/reportes/relacion-gestiones-realizadas/relacion-gestiones-realizadas.component';
import {ResumenResultadosPorGestorComponent} from './estrategia/reportes/resumen-resultados-por-gestor/resumen-resultados-por-gestor.component';
import {DetalleCarteraNoAsignadaComponent} from './estrategia/reportes/detalle-cartera-no-asignada/detalle-cartera-no-asignada.component';
import {ResumenResultadoPorFechaVencimientoComponent} from './estrategia/reportes/resumen-resultado-por-fecha-vencimiento/resumen-resultado-por-fecha-vencimiento.component';
import {CompromisoPagoComponent} from './socio/views/respuestas/compromiso-pago/compromiso-pago.component';
import {CompromisoDePagoComponent} from './estrategia/reportes/compromiso-de-pago/compromiso-de-pago.component';
import {PagosRealizadosPorDiaComponent} from './estrategia/reportes/pagos-realizados-por-dia/pagos-realizados-por-dia.component';
import {GestionCarteraComponent} from './estrategia/cartera/gestion-cartera/gestion-cartera.component';
import {GestionCarteraEditarComponent} from './estrategia/cartera/gestion-cartera-editar/gestion-cartera-editar.component';
import {ListarGestionesComponent} from './estrategia/configuracion/gestion/listar-gestiones/listar-gestiones.component';
import {CrearGestionComponent} from './estrategia/gestion/crear-gestion/crear-gestion.component';
import {EstadoCarteraComponent} from './componentes/dashboard/estado-cartera/estado-cartera.component';
import {EvaluacionCobranzaComponent} from './componentes/dashboard/evaluacion-cobranza/evaluacion-cobranza.component';
import {ComportamientoDePagoComponent} from './componentes/dashboard/comportamiento-de-pago/comportamiento-de-pago.component';
import {CarteraConAtrasoComponent} from './componentes/dashboard/cartera-con-atraso/cartera-con-atraso.component';
import {MotivoDeAtrasoComponent} from './componentes/dashboard/motivo-de-atraso/motivo-de-atraso.component';
import {RecordDeAtrasoComponent} from './componentes/dashboard/record-de-atraso/record-de-atraso.component';
import {ContactabilidadComponent} from './componentes/dashboard/contactabilidad/contactabilidad.component';
import { CreditosVencidosComponent } from './estrategia/asignacion-cartera/creditos-vencidos/creditos-vencidos.component';
import {CreditoVencidoComponent} from './estrategia/asignacion-cartera/creditos-vencidos/credito-vencido.component';
import { ExtrajudicialCarterasComponent } from './recuperacion/extrajudicial/extrajudicial-carteras/extrajudicial-carteras.component';
import { JudicialCarterasComponent } from './recuperacion/judicial/judicial-carteras/judicial-carteras.component';
import { ExtrajudicialSolicitudCambioEstadoComponent } from './recuperacion/extrajudicial/extrajudicial-solicitud-cambio-estado/extrajudicial-solicitud-cambio-estado.component';
import { ExtrajudicialSocioComponent } from './recuperacion/extrajudicial/extrajudicial-socio/extrajudicial-socio.component';
import { SociosObservadosComponent } from './estrategia/asignacion-cartera/socios-observados/socios-observados.component';
import { SocioLevantarObservacionComponent } from './estrategia/asignacion-cartera/socio-levantar-observacion/socio-levantar-observacion.component';
import { CarterasVencidasComponent } from './estrategia/procesos/cartera-vencida/carteras-vencidas/carteras-vencidas.component';
import { CarteraVencidaSocioComponent } from './estrategia/procesos/cartera-vencida/cartera-vencida-socio/cartera-vencida-socio.component';
import { CarteraObservadasComponent } from './estrategia/procesos/cartera-vencida/cartera-observadas/cartera-observadas.component';
import { CarteraObservadaComponent } from './estrategia/procesos/cartera-vencida/cartera-observada/cartera-observada.component';
import {ReasignacionGestoresComponent} from './estrategia/reasignacion-cartera/reasignacion-gestores/reasignacion-gestores.component';
import {MisAsignacionesReasignarComponent} from './estrategia/reasignacion-cartera/mis-asignaciones-reasignar/mis-asignaciones-reasignar.component';
import {ReasignarCreditosComponent} from './estrategia/reasignacion-cartera/reasignar-creditos/reasignar-creditos.component';


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
            {path: 'rol/crear', component: RolCrearComponent, canActivate: [CanAuthorityGuard]},
            {path: 'rol/editar', component: RolEditarComponent, canActivate: [CanAuthorityGuard]},

            {path: 'usuario', component: UsuarioComponent},
            {path: 'usuario/crear', component: UsuarioCrearComponent, canActivate: [CanAuthorityGuard]},
            {path: 'usuario/editar', component: UsuarioEditarComponent, canActivate: [CanAuthorityGuard]},
            {path: 'usuario/contrasenha', component: UsuarioContrasenhaComponent, canActivate: [CanAuthorityGuard]},
          ]
        },
        {
          path: 'mantenimiento',
          children: [
            {path: 'tipo-usuario', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 1, title: 'TIPOS DE USUARIO', code: A.TIPO_USUARIO_CODE}},
            {path: 'estado-registro', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: { codTable: 2, title: 'ESTADOS DE UN REGISTRO', code: A.ESTADO_REGISTRO_CODE}},
            {path: 'tipo-moneda', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 3, title: 'TIPOS DE MONEDA', code: A.TIPO_MONEDA_CODE}},
            {path: 'condicion-solicitud', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 4, title: 'CONDICIÓN DE SOLICITUD', code: A.CONDICION_SOLICITUD_CODE}},
            {path: 'tipo-credito', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 5, title: 'TIPO DE CRÉDITO PRE APROBADO', code: A.TIPO_CREDITO_CODE}},
            {path: 'tipo-cobranza', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 6, title: 'TIPO DE COBRANZA', code: A.TIPO_COBRANZA_CODE}},
            {path: 'tipo-interes', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 7, title: 'TIPO DE INTERES', code: A.TIPO_COBRANZA_CODE}},
            {path: 'tipo-tasa', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 8, title: 'TIPO DE TASA', code: A.TIPO_TASA_CODE}},
            {path: 'tipo-direciones', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 9, title: 'TABLA TIPO DE DIRECCIÓN', code: A.TIPO_DIRECCION_CODE}},
            {path: 'tipo-vivienda', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 10, title: 'TABLA TIPO VIVIENDA', code: A.TIPO_VIVIENDA_CODE}},
            {path: 'tipo-vias', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 11, title: 'TABLA TIPO DE VIAS', code: A.TIPO_VIAS_CODE}},
            {path: 'tipo-secciones', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 12, title: 'TABLA TIPO SECCIÓN', code: A.TIPO_SECCION_CODE}},
            {path: 'tipo-zonas', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 13, title: 'TABLA TIPO ZONA', code: A.TIPO_ZONAS_CODE}},
            {path: 'tipo-sectores', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 14, title: 'TABLA TIPO SECTOR', code: A.TIPO_SECTORES_CODE}},
            {path: 'uso-telefono', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 15, title: 'TABLA TIPO USO TELÉFONO', code: A.TIPO_USO_TELEFONO_CODE}},
            {path: 'tipo-operador', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 16, title: 'TABLA OPERADOR TELÉFONO', code: A.TIPO_OPERADOR_CODE}},
            {path: 'tipo-telefono', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 17, title: 'TABLA TIPO DE TELÉFONO', code: A.TIPO_TELEFONO_CODE}},
            {path: 'tipo-indicador', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 18, title: 'INDICADORES O SUMATORIAS DE CARGA CRÉDITO MANUAL', code: A.TIPO_CREDITO_CODE}},
            {path: 'tipo-documentos', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 19, title: 'TABLA DOCUMENTO IDENTIDAD', code: A.TIPO_DOCUMENTOS_CODE}},
            {path: 'estados-civil', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: { codTable: 21, title: 'TIPO DE GENERO', code: A.TIPO_GENERO_CODE}},
            {path: 'tipo-genero', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 20, title: 'ESTADO CIVIL', code: A.ESTADO_CIVIL_CODE}},
            {path: 'lista-sedes', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 22, title: 'LISTA DE SEDES', code: A.LISTA_SEDES_CODE}},
            {path: 'destino-credito', component: GestionarTablaMaestroComponent, canActivate: [CanAuthorityGuard], data: {codTable: 23, title: 'DESTINO CREDITO', code: A.DESTINO_CREDITO_CODE}}
          ]
        },
        {
          path: 'estrategia',
          children: [
            {
              path: 'carteras',
              children: [
                {path: '', component: ListarCarteraComponent, canActivate: [CanAuthorityGuard]},
                {path: 'crear', component: CrearCarteraComponent, canActivate: [CanAuthorityGuard]},
                {path: 'detalle', component: DetalleCarteraComponent, canActivate: [CanAuthorityGuard]},
                {path: 'cargar-credito', component: CarteraCargarCreditoComponent},
                {path: 'cargar-credito/socios/:cargaCreditoId', component: CarteraCargarCreditoSociosComponent},
                {path: 'cargar-credito/creditos/:cargaCreditoId', component: CarteraCargarCreditoCreditosComponent},
                {path: 'gestion', component: GestionCarteraComponent, canActivate: [CanAuthorityGuard]},
                {path: 'gestion-actualizar', component: GestionCarteraEditarComponent, canActivate: [CanAuthorityGuard]},
              ]
            },
            {path: 'notificaciones', component: EnviarNotificionComponent, canActivate: [CanAuthorityGuard]},
            {path: 'asignacion-cartera', component: AsignacionCarteraComponent},
            {path: 'asignacion-cartera/:ejecutivoUuid/configuracion', component: AsignarEtapasEjecutivoComponent},
            {path: 'asignacion-cartera/:ejecutivoUuid/listado', component: EjecutivoAsignacionesComponent},
            {path: 'asignacion-cartera/:ejecutivoUuid/listado/:asignacionUuid/detalle', component: EjecutivoCreditosComponent},
            {path: 'asignacion-cartera/:ejecutivoUuid/listado/:asignacionUuid/detalle/:nroCredito/socio', component: CreditoSocioComponent},

            { path: 'asignacion-cartera/:ejecutivoUuid/creditos-vencidos', component: CreditosVencidosComponent },
            { path: 'asignacion-cartera/:ejecutivoUuid/creditos-vencidos/:nroCredito/detalle', component: CreditoVencidoComponent },

            { path: 'asignacion-cartera/:ejecutivoUuid/socios-observados', component: SociosObservadosComponent },
            { path: 'asignacion-cartera/:ejecutivoUuid/socios-observados/:solicitudUuid/actualizar', component: SocioLevantarObservacionComponent },

            // gestor de cobranza
            {path: 'asignacion-cartera/mis-cartera-asignadas', component: EjecutivoAsignacionesComponent, data: {role: 'X'}},
            {path: 'asignacion-cartera/mis-cartera-asignadas/:asignacionUuid/detalle', component: EjecutivoCreditosComponent, data: {role: 'X'}},
            {path: 'asignacion-cartera/mis-cartera-asignadas/:asignacionUuid/detalle/:nroCredito/socio', component: CreditoSocioComponent, data: {role: 'X'}},

            // supervisor
            {path: 'asignacion-cartera/mis-asignaciones', component: SupervisorAsignacionesComponent},
            {path: 'asignacion-cartera/mis-asignaciones/configuracion', component: AsignarEtapasEjecutivoComponent},
            {path: 'asignacion-cartera/mis-asignaciones/:asignacionUuid/detalle', component: SupervisorCreditosComponent},
            {path: 'asignacion-cartera/mis-asignaciones/:asignacionUuid/detalle/:nroCredito/socio', component: SupervisorCreditoSocioComponent},
            {
              path: 'reasigacion-cartera',
              children: [
                {path: '', component: ReasignacionGestoresComponent, canActivate: [CanAuthorityGuard]},
                {path: 'gestor/:ejecutivoUuid/mis-asignaciones', component: MisAsignacionesReasignarComponent},
                {path: 'gestor/:ejecutivoUuid/mis-asignaciones/:asignacionUuid/detalle', component: ReasignarCreditosComponent},
              ]
            },
          ]
        },
        {
          path: 'configuracion',
          children: [
            {
              path: 'notificacion',
              children: [
                {path: '', component: ConfigurarNotificionComponent, canActivate: [CanAuthorityGuard]},
                {path: 'enviar', component: EnviarNotificionComponent, canActivate: [CanAuthorityGuard], data: {send: true}}
              ]
            },
            {path: 'tipo-notificacion', component: TipoNotificacionComponent, canActivate: [CanAuthorityGuard]},
            {path: 'gestiones', component: ListarGestionesComponent},
            {path: 'gestiones/registrar', component: CrearGestionComponent},
            {path: 'gestiones/actualizar', component: ActualizarGestionComponent},
          ]
        },
        {
          path: 'socio',
          children: [
            {path: 'lista-socios', component: ListaSociosComponent},
            {path: 'detalle', component: EditarSociosComponent}
          ]
        },
        {
          path: 'gestion-administrativa',
          children: [
            {path: 'tareas', component: TableroTareasComponent},
            {path: 'tareas/:slug', component: TareaDetalleComponent},

            // ejecutivo
            {path: 'mis-tareas', component: EjecutivoTareaComponent},
            {path: 'mis-tareas/:slug', component: TareaDetalleComponent, data: {role: 'X'}},
            {path: 'mis-gestiones', component: MisGestionesComponent},
            {path: 'mis-gestiones/:nroCredito/detalle', component: MisGestionesDetalleComponent},
          ]
        },
        {
          path: 'reportes',
          children: [
            {path: 'bitacora-de-gestiones', component: BitacoraGestionesComponent},
            {path: 'relacion-gestiones-realizadas', component: RelacionGestionesRealizadasComponent},
            {path: 'resumen-de-resultados-por-gestor', component: ResumenResultadosPorGestorComponent},
            {path: 'detalle-cartera-no-asignada', component: DetalleCarteraNoAsignadaComponent},
            {path: 'resumen-resultados-por-fecha-de-vencimiento', component: ResumenResultadoPorFechaVencimientoComponent},
            {path: 'compromiso-de-pago', component: CompromisoDePagoComponent},
            {path: 'pagos-realizados-por-dia', component: PagosRealizadosPorDiaComponent},
          ]
        },
        {
          path: 'dashboard',
          children: [
            {path: 'estado-de-cartera', component: EstadoCarteraComponent},
            {path: 'evolucion-de-cobranza', component: EvaluacionCobranzaComponent},
            {path: 'comportamiento-de-pago', component: ComportamientoDePagoComponent},
            {path: 'cartera-con-atraso', component: CarteraConAtrasoComponent},
            {path: 'motivo-de-atraso', component: MotivoDeAtrasoComponent},
            {path: 'record-de-atraso', component: RecordDeAtrasoComponent},
            {path: 'contactabilidad', component: ContactabilidadComponent},
          ]
        },
        {
          path: 'recuperacion',
          children: [
            {
              path: 'extrajudicial',
              children: [
                {path: 'carteras', component: ExtrajudicialCarterasComponent},
                { path: 'solicitudes', component: ExtrajudicialSolicitudCambioEstadoComponent },
                { path: 'solicitudes/:solicitudUuid/socio', component: ExtrajudicialSocioComponent }
              ]
            },
            { path: 'judicial/solicitudes', component: JudicialCarterasComponent }
          ]
        },
        {
          path: 'procesos',
          children: [
            { path: 'cartera-vencida', component: CarterasVencidasComponent },
            { path: 'cartera-vencida/:ejecutivoUuid/:nroCredito/detalle', component: CarteraVencidaSocioComponent },
            { path: 'cartera-observada', component: CarteraObservadasComponent },
            { path: 'cartera-observada/:solicitudUuid/detalle', component: CarteraObservadaComponent },
          ]
        },
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
