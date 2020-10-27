import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthModule} from './auth/auth.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EstrategiaModule} from './estrategia/estrategia.module';
import {registerLocaleData} from '@angular/common';
import localePE from '@angular/common/locales/es-PE';
import {I18n} from './i18n';
import {ComponentesModule} from './componentes/componentes.module';
import {PublicoModule} from './publico/publico.module';
import {ConfigService, configServiceInitializerFactory} from './servicios/seguridad/config.service';
import {RouterModule} from '@angular/router';
import {SocioModule} from './socio/socio.module';

registerLocaleData(localePE, 'es-PE');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AuthModule,
    PublicoModule,
    EstrategiaModule,
    ComponentesModule,
    SocioModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [I18n,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceInitializerFactory,
      deps: [ConfigService],
      multi: true
    },
    {provide: LOCALE_ID, useValue: 'es-PE'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
