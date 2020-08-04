import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsuarioUnicoDirective, UsuarioUnicoService} from './usuario-unico.directive';
import {RolUnicoDirective} from './rol-unico.directive';

@NgModule({
  declarations: [UsuarioUnicoDirective, RolUnicoDirective],
  imports: [
    CommonModule
  ],
  exports: [UsuarioUnicoService]
})
export class ValidacionesModule {
}
