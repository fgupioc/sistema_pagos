import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {RolService} from '../servicios/rol.service';
import {Observable} from 'rxjs';
import {RolUnicoDirective} from './rol-unico.directive';

@Injectable({providedIn: 'root'})
export class RolUnicoService implements AsyncValidator {
  constructor(private rolService: RolService) {
  }

  // @ts-ignore
  validate(rolId: number, control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const rolUnicoDirective = new RolUnicoDirective();
    rolUnicoDirective.setRolService(this.rolService);
    rolUnicoDirective.setRolId(rolId);
    return rolUnicoDirective.validate(control);
  }
}
