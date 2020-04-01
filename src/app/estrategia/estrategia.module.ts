
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearCarteraComponent } from './cartera/crear-cartera/crear-cartera.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarGestionComponent } from './gestion/actualizar-gestion/actualizar-gestion.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ActualizarEtapaComponent } from './etapa/actualizar-etapa/actualizar-etapa.component';
import { MyPipesModule } from '../pipes/my-pipes.module';
import {CarteraCargarCreditoComponent} from './cartera/cargar-credito/cargar-credito.component';
import {CarteraCargarCreditoFileComponent} from './cartera/cargar-credito/file/file.component';
import { ComunModule } from '../comun/comun.module';
import { RouterModule } from '@angular/router';
import { ConfigurarNotificionComponent } from './configuracion/configurar-notificion/configurar-notificion.component';
import { CrearEtapaNotificionComponent } from './configuracion/crear-etapa-notificion/crear-etapa-notificion.component';
import { EnviarNotificionComponent } from './configuracion/enviar-notificion/enviar-notificion.component';
import {CarteraCargarCreditoCreditosComponent} from './cartera/cargar-credito/creditos/creditos.component';
import {CarteraCargarCreditoSociosComponent} from './cartera/cargar-credito/socios/socios.component';

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
    CarteraCargarCreditoCreditosComponent
  ],
  imports: [
    CommonModule,
    ComunModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MyPipesModule,
    RouterModule
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
    CrearEtapaNotificionComponent
  ]
})
export class EstrategiaModule {
}
