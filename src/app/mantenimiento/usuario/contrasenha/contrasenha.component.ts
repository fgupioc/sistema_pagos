import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CONST} from '../../../comun/CONST';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {UsuarioService} from '../../../servicios/sistema/usuario.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-contrasenha',
  templateUrl: './contrasenha.component.html',
  styleUrls: ['./contrasenha.component.css']
})
export class UsuarioContrasenhaComponent implements OnInit {
  public formGroup: FormGroup;
  usuarioId = 0;
  alias = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private spinner: NgxSpinnerService,
              private usuarioService: UsuarioService, private toastr: ToastrService, private rutaActiva: ActivatedRoute) {
    this.usuarioId = this.rutaActiva.snapshot.params.id;
    this.alias = this.rutaActiva.snapshot.params.alias;
    console.log(this.alias);
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      contrasenha: ['', [Validators.required, Validators.minLength(this.contrasenhaLongitudMinima()),
        Validators.pattern(CONST.REG_EXP_CONTRASENHA)]],
      confirmarContrasenha: ['', [Validators.required]],
    });
  }

  contrasenhaLongitudMinima() {
    return CONST.N_CONTRASENHA_LONGITUD_MINIMA;
  }

  actualizarContrasenha() {
    if (this.formGroup.valid) {
      const usuario = {
        id: this.usuarioId,
        contrasenha: this.formGroup.get('contrasenha').value
      };
      this.spinner.show();
      this.usuarioService.actualizarContrasenha(usuario).subscribe(
        respuesta => {
          this.spinner.hide();
          if (respuesta.exito) {
            this.toastr.success(respuesta.mensaje, '');
            this.regresar();
          } else {
            Swal.fire('', respuesta.mensaje || '', 'error');
          }
        }
      );
    }
  }

  regresar() {
    this.router.navigate(['/auth/mantenimiento/usuario']);
  }

  verificarContrasenhasIguales() {
    if (this.formGroup.get('contrasenha').value !== this.formGroup.get('confirmarContrasenha').value) {
      this.formGroup.get('confirmarContrasenha').setErrors({diferente: true}); // Error temporal
    } else {
      this.formGroup.get('confirmarContrasenha').updateValueAndValidity();
    }
  }
}
