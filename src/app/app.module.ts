import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {MantenimientoModule} from './mantenimiento/mantenimiento.module';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from './auth/auth.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { EstrategiaModule } from './estrategia/estrategia.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    MantenimientoModule,
    EstrategiaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
