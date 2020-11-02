import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaSociosComponent } from './socio/lista-socios/lista-socios.component';
import { ComunModule } from '../comun/comun.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { MyPipesModule } from '../pipes/my-pipes.module';
import { RouterModule } from '@angular/router';
import { EditarSociosComponent } from './socio/editar-socios/editar-socios.component';
import { GestionarDireccionComponent } from './socio/gestionar-direccion/gestionar-direccion.component';
import { GestionarTelefonoComponent } from './socio/gestionar-telefono/gestionar-telefono.component';
import { GestionarCorreoComponent } from './socio/gestionar-correo/gestionar-correo.component';
import { ShowImagenComponent } from './show-imagen/show-imagen.component';

@NgModule({
  declarations: [
    ListaSociosComponent,
    EditarSociosComponent,
    GestionarDireccionComponent,
    GestionarTelefonoComponent,
    GestionarCorreoComponent,
    ShowImagenComponent
  ],
  imports: [
    CommonModule,
    ComunModule,
    NgbModule,
    ReactiveFormsModule,
    MyPipesModule,
    RouterModule
  ],
  entryComponents: [
    GestionarDireccionComponent,
    GestionarTelefonoComponent,
    GestionarCorreoComponent,
    ShowImagenComponent
  ],
  exports: [
    ShowImagenComponent
  ]
})
export class ComponentesModule { }
