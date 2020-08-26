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
import {modalConfigDefaults} from 'ngx-bootstrap/modal/modal-options.class';
import { CreditoSocioComponent } from './asignacion-cartera/credito-socio/credito-socio.component';

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
    CreditoSocioComponent
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
    ModalGestionarPromesasPagoComponent
  ]
})
export class EstrategiaModule {
}
