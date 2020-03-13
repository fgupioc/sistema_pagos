import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// import {MantenimientoRoutingModule} from './mantenimiento-routing.module';
import {UsuarioComponent} from './usuario/usuario.component';
import {UsuarioService} from '../servicios/sistema/usuario.service';

@NgModule({
  declarations: [UsuarioComponent],
  imports: [
    CommonModule,
    // MantenimientoRoutingModule
  ],
  providers: [
    UsuarioService
  ]
})
export class MantenimientoModule {
}
