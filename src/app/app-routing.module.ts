import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsuarioComponent} from './mantenimiento/usuario/usuario.component';
import {AuthComponent} from './auth/auth.component';
import {UsuarioEditarComponent} from './mantenimiento/usuario/editar/editar.component';
import {UsuarioCrearComponent} from './mantenimiento/usuario/crear/crear.component';

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
