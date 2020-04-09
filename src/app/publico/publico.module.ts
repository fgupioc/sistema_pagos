import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from '../servicios/seguridad/token.interceptor';
import {RouterModule} from '@angular/router';
import { ValidarPinComponent } from './validar-pin/validar-pin.component';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [LoginComponent, ValidarPinComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NgxSpinnerModule,
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
})
export class PublicoModule {
}
