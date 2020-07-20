import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingComponent} from './loading/loading.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SocioListDireccionesComponent} from './socios/list-direcciones/list-direcciones.component';
import {SocioListTelefonosComponent} from './socios/list-telefonos/list-telefonos.component';
import {SocioListEmailsComponent} from './socios/list-emails/list-emails.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MyPipesModule} from '../pipes/my-pipes.module';

@NgModule({
  declarations: [LoadingComponent, SocioListDireccionesComponent, SocioListTelefonosComponent, SocioListEmailsComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MyPipesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    LoadingComponent
  ]
})
export class ComunModule {
}
