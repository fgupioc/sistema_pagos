import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsuarioComponent} from './mantenimiento/usuario/usuario.component';
import {AuthComponent} from './auth/auth.component';
import {UsuarioEditarComponent} from './mantenimiento/usuario/editar/editar.component';
import {UsuarioCrearComponent} from './mantenimiento/usuario/crear/crear.component';
import {UsuarioContrasenhaComponent} from './mantenimiento/usuario/contrasenha/contrasenha.component';
import {CrearCarteraComponent} from './estrategia/cartera/crear-cartera/crear-cartera.component';
import {ActualizarGestionComponent} from './estrategia/gestion/actualizar-gestion/actualizar-gestion.component';
import {CarteraCargarCreditoComponent} from './estrategia/cartera/cargar-credito/cargar-credito.component';
import { ConfigurarNotificionComponent } from './estrategia/configuracion/configurar-notificion/configurar-notificion.component';

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent,
    children: [
      {
        path: 'mantenimiento',
        children: [
          {path: 'usuario', component: UsuarioComponent},
          {path: 'usuario/crear', component: UsuarioCrearComponent},
          {path: 'usuario/editar/:id', component: UsuarioEditarComponent},
          {path: 'usuario/contrasenha/:id/:usuario', component: UsuarioContrasenhaComponent},
        ]
      },
      {
        path: 'estrategia',
        children: [
          {
            path: 'cartera',
            children: [
              {path: 'cargar-credito', component: CarteraCargarCreditoComponent},
              {path: '', component: CrearCarteraComponent},
              {path: 'crear-gestion', component: ActualizarGestionComponent},
              {path: 'editar-gestion', component: ActualizarGestionComponent}
            ]
          },
        ]
      },
      {
        path: 'configuracion',
        children: [
          {
            path: 'notificacion',
            children: [
              {path: '', component: ConfigurarNotificionComponent}
            ]
          },
        ]
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
