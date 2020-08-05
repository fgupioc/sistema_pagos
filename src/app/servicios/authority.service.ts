import { Injectable } from '@angular/core';
import {AutenticacionService} from './seguridad/autenticacion.service';
@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  authorities: string[] = [];

  constructor(private autenticacionService: AutenticacionService) {
    this.authorities = this.autenticacionService.authorities();
  }

  has(authority: string): boolean {
    console.log(authority);
    return this.authorities.findIndex(auto => auto == authority) >= 0;
  }
}
