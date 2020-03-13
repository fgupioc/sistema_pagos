import {Routes} from '@angular/router';
import {AuthComponent} from './auth.component';


export const appRoutes: Routes = [{
  path: '', component: AuthComponent, children: [
    {path: 'mantenimiento', loadChildren: '../mantenimiento/mantenimiento.module#MantenimientoModule'}
  ]
}];
