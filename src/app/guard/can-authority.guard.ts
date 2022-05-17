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
    return true;
  }
}
