import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// import {MantenimientoRoutingModule} from './mantenimiento-routing.module';
import {UsuarioComponent} from './usuario/usuario.component';
import {UsuarioService} from '../servicios/sistema/usuario.service';
import {ComunModule} from '../comun/comun.module';
import {NgbModalModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioEditarComponent} from './usuario/editar/editar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [UsuarioComponent, UsuarioEditarComponent],
  imports: [
    CommonModule,
    ComunModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbNavModule,
    ReactiveFormsModule,

    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added

  ],
  entryComponents: [UsuarioEditarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    UsuarioService
  ]
})
export class MantenimientoModule {
}
