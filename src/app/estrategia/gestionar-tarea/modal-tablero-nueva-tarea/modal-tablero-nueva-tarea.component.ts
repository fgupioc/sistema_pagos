import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {EjecutivoAsignacion} from '../../../interfaces/ejecutivo-asignacion';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FUNC} from '../../../comun/FUNC';

export interface IEjecutivo {
  alias: string;
  codEstado: string;
  codUsuario: number;
  descripcion: string;
  email: string;
  fechaFinal: number;
  fechaInicio: number;
  numeroCelular: string;
}

@Component({
  selector: 'app-modal-tablero-nueva-tarea',
  templateUrl: './modal-tablero-nueva-tarea.component.html',
  styleUrls: ['./modal-tablero-nueva-tarea.component.css']
})
export class ModalTableroNuevaTareaComponent implements OnInit {
  tablero: EjecutivoAsignacion;
  ejecutivos: IEjecutivo[] = [];
  formulario: FormGroup;


  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal,
    private gestionAdministrativaService: GestionAdministrativaService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      ejecutivoId: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      visibilidad: ['', [Validators.required]],

    });
  }

  crear() {
    if (this.formulario.invalid) {
      Swal.fire('Nueva Tarear', 'Ingrese los datos obligatorios', 'warning');
      return;
    }
    const data: EjecutivoAsignacion = this.formulario.getRawValue();
    data.slug = FUNC.slugGenerate(data.nombre);
    this.spinner.show();
    this.gestionAdministrativaService.crearAsignacionTarea(data).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Crear Nuevo Tablero', res.mensaje, 'success');
          this.activeModal.dismiss({flag: true});
        } else {
          Swal.fire('Crear Nuevo Tablero', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => {
        Swal.fire('Crear Nuevo Tablero', 'Ocurrio un error', 'success');
      }
    );
  }

}
