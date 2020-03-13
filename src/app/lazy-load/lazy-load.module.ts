import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  // {path: '', loadChildren: '../public/public.module#PublicModule'},
  {path: 'auth', loadChildren: '../auth/auth.module#AuthModule'},
  // {path: '**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LazyLoadModule {
}
