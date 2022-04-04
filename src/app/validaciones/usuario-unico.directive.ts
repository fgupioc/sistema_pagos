import {Directive, Injectable} from '@angular/core';
import {UsuarioService} from '../servicios/sistema/usuario.service';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Directive({
  selector: '[appUsuarioUnico]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UsuarioUnicoDirective, multi: true}]
})
export class UsuarioUnicoDirective implements AsyncValidator {
  usuarioService: UsuarioService;
  usuarioId: number;

  constructor() {
  }

  public setUsuarioService(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
  }

  public setUsuarioId(usuarioId: number) {
    this.usuarioId = usuarioId;
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.usuarioService.validarUsuarioUnico(this.usuarioId, control.value)
      .pipe(map(resp => {
          return resp.exito ? null : {emailTomado: true};
        })
      );
  }
}
