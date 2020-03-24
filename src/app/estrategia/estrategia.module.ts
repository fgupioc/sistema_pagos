import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CrearCarteraComponent} from './cartera/crear-cartera/crear-cartera.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ActualizarGestionComponent} from './gestion/actualizar-gestion/actualizar-gestion.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ActualizarEtapaComponent} from './etapa/actualizar-etapa/actualizar-etapa.component';
import {ComunModule} from '../comun/comun.module';
import {CarteraCargarCreditoComponent} from './cartera/cargar-credito/cargar-credito.component';
import {CarteraCargarCreditoFileComponent} from './cartera/cargar-credito/file/file.component';

@NgModule({
  declarations: [
    CrearCarteraComponent,
    ActualizarGestionComponent,
    ActualizarEtapaComponent,
    CarteraCargarCreditoComponent,
    CarteraCargarCreditoFileComponent
  ],
  imports: [
    CommonModule,
    ComunModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    ComunModule,
  ],
  exports: [
    CrearCarteraComponent,
    ActualizarGestionComponent,
    ActualizarEtapaComponent
  ],
  entryComponents: [
    ActualizarGestionComponent,
    ActualizarEtapaComponent,
    CarteraCargarCreditoFileComponent
  ]
})
export class EstrategiaModule {
}
