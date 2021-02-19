import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaSociosComponent } from './socio/lista-socios/lista-socios.component';
import { ComunModule } from '../comun/comun.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
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
    ComportamientoDePagoComponent
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
  ],
  entryComponents: [
    GestionarDireccionComponent,
    GestionarTelefonoComponent,
    GestionarCorreoComponent,
    ShowImagenComponent
  ],
    exports: [
        ShowImagenComponent,
        EstadoCarteraComponent,
        EvaluacionCobranzaComponent,
      ComportamientoDePagoComponent
    ],
  providers: [ThemeService]
})
export class ComponentesModule { }
