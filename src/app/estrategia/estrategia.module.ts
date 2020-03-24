import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearCarteraComponent } from './cartera/crear-cartera/crear-cartera.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarGestionComponent } from './gestion/actualizar-gestion/actualizar-gestion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActualizarEtapaComponent } from './etapa/actualizar-etapa/actualizar-etapa.component';
import { LoadingComponent } from '../comun/loading/loading.component';
import { ComunModule } from '../comun/comun.module';
import { MyPipesModule } from '../pipes/my-pipes.module';

@NgModule({
  declarations: [
    CrearCarteraComponent,
    ActualizarGestionComponent,
    ActualizarEtapaComponent
  ],
  imports: [
    CommonModule,
    ComunModule,
    NgbModule,
    ReactiveFormsModule,
    MyPipesModule
  ],
  exports: [
    CrearCarteraComponent,
    ActualizarGestionComponent,
    ActualizarEtapaComponent
  ],
  entryComponents: [
    ActualizarGestionComponent,
    ActualizarEtapaComponent
  ]
})
export class EstrategiaModule { }
