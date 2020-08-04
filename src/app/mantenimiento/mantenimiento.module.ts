import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsuarioComponent} from './usuario/usuario.component';
import {UsuarioService} from '../servicios/sistema/usuario.service';
import {ComunModule} from '../comun/comun.module';
import {NgbModalModule, NgbModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioEditarComponent} from './usuario/editar/editar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TreeviewModule} from 'ngx-treeview';
import {UsuarioCrearComponent} from './usuario/crear/crear.component';
import {DataTablesModule} from 'angular-datatables';
import {UsuarioContrasenhaComponent} from './usuario/contrasenha/contrasenha.component';
import {MyPipesModule} from '../pipes/my-pipes.module';
import {RolComponent} from './rol/rol.component';
import {RolCrearComponent} from './rol/rol-crear.component';
import {RolEditarComponent} from './rol/rol-editar.component';
import {RolBuscarUsuarioComponent} from './rol-buscar-usuario/rol-buscar-usuario.component';
import {ComponentesModule} from '../componentes/componentes.module';

@NgModule({
  declarations: [
    UsuarioComponent,
    UsuarioEditarComponent,
    UsuarioCrearComponent,
    UsuarioContrasenhaComponent,
    RolComponent,
    RolCrearComponent,
    RolEditarComponent,
    RolBuscarUsuarioComponent],
  imports: [
    CommonModule,
    ComunModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbNavModule,
    ReactiveFormsModule,

    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added

    TreeviewModule.forRoot(),
    DataTablesModule,
    MyPipesModule,


    FormsModule,
    ComponentesModule,
    NgbModule,
  ],
  entryComponents: [UsuarioCrearComponent, UsuarioEditarComponent, RolBuscarUsuarioComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    UsuarioService
  ]
})
export class MantenimientoModule {
}
