import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UsuarioService} from '../../../servicios/sistema/usuario.service';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class UsuarioEditarComponent implements OnInit {
  usuarioId = 0;
  public formGroup: FormGroup;
  tiposUsuarios = [];
  estados = [];
  datePipe = new DatePipe('es-PE');

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private usuarioService: UsuarioService,
              private maestroService: MaestroService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      fechaInicioSesion: ['', [Validators.required]],
      fechaFinSesion: ['', [Validators.required]],
      codTipoUsuario: ['', [Validators.required]],
      codEstado: ['', [Validators.required]],
      inicioCierre: ['', [Validators.required]],
      /*
      administraUsuario: ['', [Validators.required]],
      usuarioActivo: ['', [Validators.required]],
      cierreIniDia: ['', [Validators.required]],*/
    });
    this.listarTiposDeUsuarios();
    this.listarEstadosDeRegistro();
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.usuarioService.obtenerUsuario(this.usuarioId).subscribe(usuario => {

      this.formGroup.get('usuario').setValue(usuario.usuario);
      this.formGroup.get('fechaInicioSesion').setValue(this.datePipe.transform(usuario.fechaFinSesion, 'yyyy-MM-dd'));
      this.formGroup.get('fechaFinSesion').setValue(this.datePipe.transform(usuario.fechaFinSesion, 'yyyy-MM-dd'));
      this.formGroup.get('codTipoUsuario').setValue(usuario.codTipoUsuario);
      this.formGroup.get('codEstado').setValue(usuario.codEstado);
      this.formGroup.get('inicioCierre').setValue(usuario.inicioCierre);

    });
  }

  listarTiposDeUsuarios() {
    this.maestroService.listarTiposDeUsuarios().subscribe(res => this.tiposUsuarios = res);
  }

  listarEstadosDeRegistro() {
    this.maestroService.listarEstadosDeRegistro().subscribe(res => this.estados = res);
  }

  saveUsuario() {
    const usuario = {
      id: this.usuarioId,
      usuario: this.formGroup.get('usuario').value,
      fechaInicioSesion: this.formGroup.get('fechaInicioSesion').value,
      fechaFinSesion: this.formGroup.get('fechaFinSesion').value,
      codTipoUsuario: this.formGroup.get('codTipoUsuario').value,
      codEstado: this.formGroup.get('codEstado').value,
      inicioCierre: this.formGroup.get('inicioCierre').value,
    };
    const usuarioActualizar = {
      usuario,
    };
    this.spinner.show();
    this.usuarioService.actualizar(usuarioActualizar).subscribe(
      respuesta => {
        if (respuesta.exito) {
          this.toastr.success(respuesta.mensaje, '');
          this.activeModal.close(true);
        } else {
          Swal.fire('', respuesta.mensaje, 'error');
        }

        this.spinner.hide();
      }
    );
  }

  buscarUsuarioPorId() {

  }


}
