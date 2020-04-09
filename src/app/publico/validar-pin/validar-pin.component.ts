import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UsuarioService} from '../../servicios/sistema/usuario.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {CONST} from '../../comun/CONST';

@Component({
  selector: 'app-validar-pin',
  templateUrl: './validar-pin.component.html',
  styleUrls: ['./validar-pin.component.css']
})
export class ValidarPinComponent implements OnInit {

  formValidar: FormGroup;
  formRestaurar: FormGroup;
  formPin: FormGroup;
  showValidar = true;
  showPin = false;
  showChange = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.formValidar = this.formBuilder.group({
      email: ['', {
        validators: [
          Validators.required, Validators.email,
          Validators.pattern(CONST.C_STR_EXP_REGULAR_EMAIL)
        ]
      }]
    });
    this.formRestaurar = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(CONST.REG_EXP_CONTRASENHA)
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(CONST.REG_EXP_CONTRASENHA)
      ])),
    }, (c: AbstractControl) => {
      if (c.get('password').value !== c.get('confirmPassword').value) {
        c.get('confirmPassword').setErrors({passwordMismatch: true});
        return {passwordMismatch: true};
      }
      return null;
    });
    this.formPin = this.formBuilder.group({
      pin: ['', {
        validators: [
          Validators.required,
          Validators.minLength(6)
        ]
      }]
    });
  }

  generarCodigo() {
    this.spinner.show();
    // CONST.C_STR_FROM_ADMIN
    this.usuarioService.codigoRestaurarPassword(this.formValidar.get('email').value, null).subscribe(
      result => {
        if (result.exito) {
          this.toastr.success(result.mensaje);
          this.showValidar = false;
          this.showPin = true;
          this.showChange = false;
        } else {
          this.toastr.error(result.mensaje);
        }
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  validarPin() {
    this.spinner.show();
    this.usuarioService.verificarCodigoRestauracion(this.formValidar.get('email').value, this.formPin.get('pin').value).subscribe(
      result => {
        if (result.exito) {
          this.showValidar = false;
          this.showPin = false;
          this.showChange = true;
        } else {
          this.toastr.error(result.mensaje);
        }
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  actualizarPassword() {
    this.spinner.show();
    this.usuarioService.cambiarPassword(
      this.formValidar.get('email').value,
      this.formPin.get('pin').value,
      this.formRestaurar.get('password').value
    ).subscribe(
      result => {
        if (result.exito) {
          this.toastr.success('Se actualizo sus contraseña correctamente');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(result.mensaje);
        }

        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  solictarNuevoCodigo() {
    this.showValidar = true;
    this.showPin = false;
    this.showChange = false;
    this.formValidar.get('email').setValue('');
    this.formPin.get('pin').setValue('');
  }
}
