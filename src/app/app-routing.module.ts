import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsuarioComponent} from './mantenimiento/usuario/usuario.component';
import {AuthComponent} from './auth/auth.component';
import { CrearCarteraComponent } from './estrategia/cartera/crear-cartera/crear-cartera.component';
import { ActualizarGestionComponent } from './estrategia/gestion/actualizar-gestion/actualizar-gestion.component';

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent,
    children: [
      {
        path: 'mantenimiento',
        children: [
          {path: 'usuario', component: UsuarioComponent},
        ]
      },
      {
        path: 'estrategia',
        children: [
          {
            path: 'cartera',
            children: [
              {path: '', component: CrearCarteraComponent},
              {path: 'crear-gestion', component: ActualizarGestionComponent}
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
