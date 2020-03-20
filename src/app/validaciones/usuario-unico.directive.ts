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

  constructor(private usuarioService: UsuarioService, private usuarioId: number) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.usuarioService.validarUsuarioUnico(this.usuarioId, control.value)
      .pipe(map(resp => {
          return resp.exito ? null : {usuarioTomado: true};
        })
      );
  }
}

@Injectable({providedIn: 'root'})
export class UsuarioUnicoService implements AsyncValidator {
  constructor(private usuarioService: UsuarioService) {
  }

  // @ts-ignore
  validate(usuarioId: number, control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const usuarioUnicoDirective = new UsuarioUnicoDirective(this.usuarioService, usuarioId);
    return usuarioUnicoDirective.validate(control);
  }
}
