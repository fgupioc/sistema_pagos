import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearCarteraComponent } from './cartera/crear-cartera/crear-cartera.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarGestionComponent } from './gestion/actualizar-gestion/actualizar-gestion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActualizarEtapaComponent } from './etapa/actualizar-etapa/actualizar-etapa.component';

@NgModule({
  declarations: [
    CrearCarteraComponent,
    ActualizarGestionComponent,
    ActualizarEtapaComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    CommonModule, 
    ReactiveFormsModule,
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
