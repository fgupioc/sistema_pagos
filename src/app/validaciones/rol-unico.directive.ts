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

  constructor(private rolService: RolService, private rolId: number) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.rolService.validarRolUnico(this.rolId, control.value)
      .pipe(map(resp => {
          return resp.codigo == CONST.C_STR_CODIGO_SUCCESS ? null : {rolTomado: true};
        })
      );
  }
}

@Injectable({providedIn: 'root'})
export class RolUnicoService implements AsyncValidator {
  constructor(private rolService: RolService) {
  }

  // @ts-ignore
  validate(rolId: number, control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const rolUnicoDirective = new RolUnicoDirective(this.rolService, rolId);
    return rolUnicoDirective.validate(control);
  }
}
