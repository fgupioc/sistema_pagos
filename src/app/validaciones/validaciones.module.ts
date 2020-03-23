import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsuarioUnicoDirective, UsuarioUnicoService} from './usuario-unico.directive';

@NgModule({
  declarations: [UsuarioUnicoDirective],
  imports: [
    CommonModule
  ],
  exports: [UsuarioUnicoService]
})
export class ValidacionesModule {
}
