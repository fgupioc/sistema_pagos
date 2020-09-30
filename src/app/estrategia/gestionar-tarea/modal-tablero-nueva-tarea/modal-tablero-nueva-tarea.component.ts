import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

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

  name: any;
  visible: any;
  ejecutivos: IEjecutivo[] = [];
  codEjec: any;

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.listarEjecutivos();
  }

  listarEjecutivos() {
    this.asignacionService.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
        }
      },
      err => {
        console.log(err);
      }
    );
  }


  crear() {
    if (!this.name || !this.visible ) {
      Swal.fire('Nueva Tarear', 'Ingrese los datos obligatorios', 'warning');
      return;
    }
    console.log(this.name);
    console.log(this.visible);
  }

}
