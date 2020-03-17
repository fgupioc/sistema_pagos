import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {MantenimientoModule} from './mantenimiento/mantenimiento.module';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from './auth/auth.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,

    AppRoutingModule,
    AuthModule,
    MantenimientoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
