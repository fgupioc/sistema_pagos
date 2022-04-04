import {Directive, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RolService} from '../servicios/rol.service';
import {CONST} from '../comun/CONST';

@Directive({
  selector: '[appRolUnico]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: RolUnicoDirective, multi: true}]
})
export class RolUnicoDirective implements AsyncValidator {
  rolService: RolService;
  rolId: number;

  constructor() {
  }

  public setRolService(rolService: RolService) {
    this.rolService = rolService;
  }

  public setRolId(rolId: number) {
    this.rolId = rolId;
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.rolService.validarRolUnico(this.rolId, control.value)
      .pipe(map(resp => {
          return resp.codigo == CONST.C_STR_CODIGO_SUCCESS ? null : {rolTomado: true};
        })
      );
  }
}
