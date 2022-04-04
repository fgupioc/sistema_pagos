import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {UsuarioService} from '../servicios/sistema/usuario.service';
import {Observable} from 'rxjs';
import {UsuarioUnicoDirective} from './usuario-unico.directive';


@Injectable({providedIn: 'root'})
export class UsuarioUnicoService implements AsyncValidator {
  constructor(private usuarioService: UsuarioService) {
  }

  // @ts-ignore
  validate(usuarioId: number, control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const usuarioUnicoDirective = new UsuarioUnicoDirective();
    usuarioUnicoDirective.setUsuarioService(this.usuarioService);
    usuarioUnicoDirective.setUsuarioId(usuarioId);
    return usuarioUnicoDirective.validate(control);
  }
}
