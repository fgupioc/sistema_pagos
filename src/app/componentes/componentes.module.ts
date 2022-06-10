import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaSociosComponent } from './socio/lista-socios/lista-socios.component';
import { ComunModule } from '../comun/comun.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MyPipesModule } from '../pipes/my-pipes.module';
import { RouterModule } from '@angular/router';
import { EditarSociosComponent } from './socio/editar-socios/editar-socios.component';
import { GestionarDireccionComponent } from './socio/gestionar-direccion/gestionar-direccion.component';
import { GestionarTelefonoComponent } from './socio/gestionar-telefono/gestionar-telefono.component';
import { GestionarCorreoComponent } from './socio/gestionar-correo/gestionar-correo.component';
import { ShowImagenComponent } from './show-imagen/show-imagen.component';
import { EstadoCarteraComponent } from './dashboard/estado-cartera/estado-cartera.component';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { EvaluacionCobranzaComponent } from './dashboard/evaluacion-cobranza/evaluacion-cobranza.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ChartEstadoCarteraComponent } from './dashboard/estado-cartera/chart-estado-cartera.component';
import { ProgressEvaluacionCobranzaComponent } from './dashboard/evaluacion-cobranza/progress-evaluacion-cobranza.component';
import { ComportamientoDePagoComponent } from './dashboard/comportamiento-de-pago/comportamiento-de-pago.component';
import { CarteraConAtrasoComponent } from './dashboard/cartera-con-atraso/cartera-con-atraso.component';
import { ChartCarteraConAtrasoComponent } from './dashboard/cartera-con-atraso/chart-cartera-con-atraso.component';
import { MotivoDeAtrasoComponent } from './dashboard/motivo-de-atraso/motivo-de-atraso.component';
import { RecordDeAtrasoComponent } from './dashboard/record-de-atraso/record-de-atraso.component';
import { ContactabilidadComponent } from './dashboard/contactabilidad/contactabilidad.component';
import { ChartContactabilidadComponent } from './dashboard/chart-contactabilidad/chart-contactabilidad.component';
import {DataTablesModule} from 'angular-datatables';
import { CarteraConAtrasoDetalleComponent } from './dashboard/modals/cartera-con-atraso-detalle/cartera-con-atraso-detalle.component';
import { CreditosEstadoCarteraComponent } from './dashboard/estado-cartera/creditos-estado-cartera/creditos-estado-cartera.component';
import { ModalMotivoDeAtrasoDetalleComponent } from './dashboard/motivo-de-atraso/modal-motivo-de-atraso-detalle/modal-motivo-de-atraso-detalle.component';


@NgModule({
  declarations: [
    ListaSociosComponent,
    EditarSociosComponent,
    GestionarDireccionComponent,
    GestionarTelefonoComponent,
    GestionarCorreoComponent,
    ShowImagenComponent,
    EstadoCarteraComponent,
    EvaluacionCobranzaComponent,
    ChartEstadoCarteraComponent,
    ProgressEvaluacionCobranzaComponent,
    ComportamientoDePagoComponent,
    CarteraConAtrasoComponent,
    ChartCarteraConAtrasoComponent,
    MotivoDeAtrasoComponent,
    RecordDeAtrasoComponent,
    ContactabilidadComponent,
    ChartContactabilidadComponent,
    CarteraConAtrasoDetalleComponent,
    CreditosEstadoCarteraComponent,
    ModalMotivoDeAtrasoDetalleComponent
  ],
    imports: [
        CommonModule,
        ComunModule,
        NgbModule,
        ReactiveFormsModule,
        MyPipesModule,
        RouterModule,
        ChartsModule,
        ProgressbarModule.forRoot(),
        FormsModule,
        DataTablesModule,
    ],
  entryComponents: [
    GestionarDireccionComponent,
    GestionarTelefonoComponent,
    GestionarCorreoComponent,
    ShowImagenComponent,
    CarteraConAtrasoDetalleComponent,
    CreditosEstadoCarteraComponent,
    ModalMotivoDeAtrasoDetalleComponent
  ],
  exports: [
    ShowImagenComponent,
    EstadoCarteraComponent,
    EvaluacionCobranzaComponent,
    ComportamientoDePagoComponent,
    CarteraConAtrasoComponent,
    MotivoDeAtrasoComponent,
    RecordDeAtrasoComponent,
    ContactabilidadComponent
  ],
  providers: [ThemeService]
})
export class ComponentesModule { }
