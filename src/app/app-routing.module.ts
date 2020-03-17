import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsuarioComponent} from './mantenimiento/usuario/usuario.component';
import {AuthComponent} from './auth/auth.component';

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent,
    children: [
      {
        path: 'mantenimiento',
        children: [
          {path: 'usuario', component: UsuarioComponent},
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
