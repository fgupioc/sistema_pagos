import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ComunModule} from '../comun/comun.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from '../servicios/seguridad/token.interceptor';
import {ErrorsInterceptor} from '../servicios/seguridad/errors.interceptor';
import {SocioCreditosComponent} from './views/socio-creditos/socio-creditos.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MyPipesModule} from '../pipes/my-pipes.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {SocioCreditoDetalleComponent} from './views/socio-credito-detalle/socio-credito-detalle.component';
import {YaPagueComponent} from './views/respuestas/ya-pague/ya-pague.component';
import {AgmCoreModule} from '@agm/core';
import { LlamenmeComponent } from './views/respuestas/llamenme/llamenme.component';
import { ReclamoComponent } from './views/respuestas/reclamo/reclamo.component';
import { CompromisoPagoComponent } from './views/respuestas/compromiso-pago/compromiso-pago.component';

@NgModule({
  declarations: [
    SocioCreditosComponent,
    SocioCreditoDetalleComponent,
    YaPagueComponent,
    LlamenmeComponent,
    ReclamoComponent,
    CompromisoPagoComponent
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyATTjzPJ2jmiEJTscRjdIz72EhG6LEGiT0',
      libraries: ['places']
    })
  ],
  entryComponents: [
    YaPagueComponent,
    LlamenmeComponent,
    ReclamoComponent,
    CompromisoPagoComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true},
  ],
})
export class SocioModule {
}
