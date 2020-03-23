import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearCarteraComponent } from './cartera/crear-cartera/crear-cartera.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarGestionComponent } from './gestion/actualizar-gestion/actualizar-gestion.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CrearCarteraComponent, ActualizarGestionComponent],
  imports: [
    CommonModule,
    NgbModule,
    CommonModule, 
    ReactiveFormsModule,
  ],
  exports: [
    CrearCarteraComponent,
    ActualizarGestionComponent
  ],
  entryComponents: [
    ActualizarGestionComponent
  ]
})
export class EstrategiaModule { }
