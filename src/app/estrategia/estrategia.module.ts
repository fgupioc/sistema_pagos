import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CrearCarteraComponent} from './cartera/crear-cartera/crear-cartera.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ActualizarGestionComponent} from './gestion/actualizar-gestion/actualizar-gestion.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActualizarEtapaComponent} from './etapa/actualizar-etapa/actualizar-etapa.component';
import {MyPipesModule} from '../pipes/my-pipes.module';
import {CarteraCargarCreditoComponent} from './cartera/cargar-credito/cargar-credito.component';
import {CarteraCargarCreditoFileComponent} from './cartera/cargar-credito/file/file.component';
import {ComunModule} from '../comun/comun.module';
import {RouterModule} from '@angular/router';
import {ConfigurarNotificionComponent} from './configuracion/configurar-notificion/configurar-notificion.component';
import {CrearEtapaNotificionComponent} from './configuracion/crear-etapa-notificion/crear-etapa-notificion.component';
import {EnviarNotificionComponent} from './configuracion/enviar-notificion/enviar-notificion.component';
import {CarteraCargarCreditoCreditosComponent} from './cartera/cargar-credito/creditos/creditos.component';
import {CarteraCargarCreditoSociosComponent} from './cartera/cargar-credito/socios/socios.component';
import {SocioListDireccionesComponent} from '../comun/socios/list-direcciones/list-direcciones.component';
import {SocioListTelefonosComponent} from '../comun/socios/list-telefonos/list-telefonos.component';
import {SocioListEmailsComponent} from '../comun/socios/list-emails/list-emails.component';
import {ListarCarteraComponent} from './cartera/listar-cartera/listar-cartera.component';
import {DetalleCarteraComponent} from './cartera/detalle-cartera/detalle-cartera.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {TipoNotificacionComponent} from './config/tipo-notificacion/tipo-notificacion.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {GestionarTablaMaestroComponent} from './mantenimiento/gestionar-tabla-maestro/gestionar-tabla-maestro.component';
import {ModalMaestroComponent} from './mantenimiento/modal-maestro/modal-maestro.component';
import { MantenedorTipoNotificacionComponent } from './config/mantenedor-tipo-notificacion/mantenedor-tipo-notificacion.component';
import { AsignacionCarteraComponent } from './asignacion-cartera/asignacion-cartera.component';
import {TreeviewModule} from 'ngx-treeview';
import { AsignarEtapasEjecutivoComponent } from './asignacion-cartera/asignar-etapas-ejecutivo/asignar-etapas-ejecutivo.component';
import { EjecutivoCreditosComponent } from './asignacion-cartera/ejecutivo-creditos/ejecutivo-creditos.component';
import { ModalGestionarTareaComponent } from './asignacion-cartera/modal-gestionar-tarea/modal-gestionar-tarea.component';
import { ModalGestionarPromesasPagoComponent } from './asignacion-cartera/modal-gestionar-promesas-pago/modal-gestionar-promesas-pago.component';
import { CreditoSocioComponent } from './asignacion-cartera/credito-socio/credito-socio.component';
import {NgWizardConfig, NgWizardModule, THEME} from 'ng-wizard';
import { EjecutivoAsignacionesComponent } from './asignacion-cartera/ejecutivo-asignaciones/ejecutivo-asignaciones.component';
import {ModalAgregarCreditoComponent} from './asignacion-cartera/modal-agregar-credito/modal-agregar-credito.component';
import { ModalAsignarEstadoRecordatorioComponent } from './asignacion-cartera/modal-asignar-estado-recordatorio/modal-asignar-estado-recordatorio.component';
import { MisCarterasAsignadasComponent } from './asignacion-cartera/mis-carteras-asignadas/mis-carteras-asignadas.component';
import { EjecutivoTareaComponent } from './gestionar-tarea/ejecutivo-tarea/ejecutivo-tarea.component';
import { TableroTareasComponent } from './gestionar-tarea/tablero-tareas/tablero-tareas.component';
import {BsDropdownModule} from 'ngx-bootstrap';
import { ModalNuevaTareasComponent } from './gestionar-tarea/modal-nueva-tareas/modal-nueva-tareas.component';
import { TareaDetalleComponent } from './gestionar-tarea/tarea-detalle/tarea-detalle.component';
import {BrowserModule} from '@angular/platform-browser';
import {DndModule} from 'ngx-drag-drop';
import { ModalTableroNuevaTareaComponent } from './gestionar-tarea/modal-tablero-nueva-tarea/modal-tablero-nueva-tarea.component';
import {NgxDropzoneModule} from 'ngx-dropzone';
import { MisGestionesComponent } from './ejecutivo/mis-gestiones/mis-gestiones.component';
import { MisGestionesDetalleComponent } from './ejecutivo/mis-gestiones-detalle/mis-gestiones-detalle.component';
import {DataTablesModule} from 'angular-datatables';
import {AsignacionCarteraService} from '../servicios/asignacion-cartera.service';
import { SupervisorAsignacionesComponent } from './asignacion-cartera/supervisor-asignaciones/supervisor-asignaciones.component';
import { SupervisorCreditosComponent } from './asignacion-cartera/supervisor-creditos/supervisor-creditos.component';
import { SupervisorCreditoSocioComponent } from './asignacion-cartera/supervisor-credito-socio/supervisor-credito-socio.component';
import { BitacoraGestionesComponent } from './reportes/bitacora-gestiones/bitacora-gestiones.component';
import { RelacionGestionesRealizadasComponent } from './reportes/relacion-gestiones-realizadas/relacion-gestiones-realizadas.component';
import { ResumenResultadosPorGestorComponent } from './reportes/resumen-resultados-por-gestor/resumen-resultados-por-gestor.component';
import { DetalleCarteraNoAsignadaComponent } from './reportes/detalle-cartera-no-asignada/detalle-cartera-no-asignada.component';
const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    CrearCarteraComponent,
    ActualizarGestionComponent,
    ActualizarEtapaComponent,
    CarteraCargarCreditoComponent,
    CarteraCargarCreditoFileComponent,
    ConfigurarNotificionComponent,
    CrearEtapaNotificionComponent,
    EnviarNotificionComponent,
    CarteraCargarCreditoSociosComponent,
    CarteraCargarCreditoCreditosComponent,
    ListarCarteraComponent,
    DetalleCarteraComponent,
    TipoNotificacionComponent,
    GestionarTablaMaestroComponent,
    ModalMaestroComponent,
    MantenedorTipoNotificacionComponent,
    AsignacionCarteraComponent,
    AsignarEtapasEjecutivoComponent,
    EjecutivoCreditosComponent,
    ModalGestionarTareaComponent,
    ModalGestionarPromesasPagoComponent,
    CreditoSocioComponent,
    EjecutivoAsignacionesComponent,
    ModalAgregarCreditoComponent,
    ModalAsignarEstadoRecordatorioComponent,
    MisCarterasAsignadasComponent,
    EjecutivoTareaComponent,
    TableroTareasComponent,
    ModalNuevaTareasComponent,
    TareaDetalleComponent,
    ModalTableroNuevaTareaComponent,
    MisGestionesComponent,
    MisGestionesDetalleComponent,
    SupervisorAsignacionesComponent,
    SupervisorCreditosComponent,
    SupervisorCreditoSocioComponent,
    BitacoraGestionesComponent,
    RelacionGestionesRealizadasComponent,
    ResumenResultadosPorGestorComponent,
    DetalleCarteraNoAsignadaComponent
  ],
  imports: [
    CommonModule,
    ComunModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MyPipesModule,
    RouterModule,
    NgSelectModule,
    NgxSpinnerModule,
    TreeviewModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig),
    BsDropdownModule,
    BrowserModule,
    DndModule,
    NgxDropzoneModule,
    DataTablesModule
  ],
  exports: [
    CrearCarteraComponent,
    ActualizarGestionComponent,
    ActualizarEtapaComponent,
    ConfigurarNotificionComponent
  ],
  entryComponents: [
    ActualizarGestionComponent,
    ActualizarEtapaComponent,
    CarteraCargarCreditoFileComponent,
    CrearEtapaNotificionComponent,
    SocioListDireccionesComponent,
    SocioListTelefonosComponent,
    SocioListEmailsComponent,
    ModalMaestroComponent,
    MantenedorTipoNotificacionComponent,
    ModalGestionarTareaComponent,
    ModalGestionarPromesasPagoComponent,
    ModalAgregarCreditoComponent,
    ModalAsignarEstadoRecordatorioComponent,
    ModalNuevaTareasComponent,
    ModalTableroNuevaTareaComponent
  ],
  providers: [
    AsignacionCarteraService
  ]
})
export class EstrategiaModule {
}
