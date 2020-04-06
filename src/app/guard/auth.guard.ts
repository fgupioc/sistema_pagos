import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {AutenticacionService} from '../servicios/seguridad/autenticacion.service';
import {map} from 'rxjs/operators';
import {Usuario} from '../interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authentication: AutenticacionService,
    private router: Router,
    private toastr: ToastrService
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivateRoute(next, state);
  }

  private canActivateRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authentication.loggedUser$.pipe(
      map(loggedUser => {
        const res = this.checkRoute(route, state, loggedUser);
        // console.log(route.url);
        // console.log(state.url);
        // console.log(`can activate route '${state.url}' '${route.url}' ${res}`);
        return res;
      })
    );
  }

  private checkRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, user: Usuario): boolean {
    if (user === null) {
      this.router.navigate(['/']);
      return false;
    }
    /*
    if (user.codigoEmpresa === null || user.codigoEmpresa < 1
      || user.role === AppConstante.C_STR_EMPLEADO ||
      user.estado === AppConstante.C_STR_ESTADO_INACTIVO) {
      this.toastr.error('Cradenciales invalidad.');
      this.authentication.logout('');
      return false;
    }*/

    return true;
  }
}
