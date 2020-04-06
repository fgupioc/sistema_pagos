import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AutenticacionService} from '../servicios/seguridad/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private auth: AutenticacionService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.auth.loggedUser$.subscribe(
      result => {
        if (result !== null) {
          this.router.navigate(['/auth/dashboard']);
          return false;
        }
      }
    );
    return true;
  }

}
