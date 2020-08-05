import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AutenticacionService} from '../servicios/seguridad/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class CanAuthorityGuard implements CanActivate {
  authorities: string[] = [];

  constructor(private autenticacionService: AutenticacionService) {
    this.authorities = this.autenticacionService.authorities();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authoritiesInput = next.data.autorizaciones as Array<string>;
    let find = false;
    for (const authority of authoritiesInput) {
      if (this.authorities.findIndex(auto => auto == authority) >= 0) {
        find = true;
        break;
      }
    }
    return find;
  }
}
