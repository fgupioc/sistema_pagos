import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
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
  selector: 'app-modal-nueva-tareas',
  templateUrl: './modal-nueva-tareas.component.html',
  styleUrls: ['./modal-nueva-tareas.component.css']
})

export class ModalNuevaTareasComponent implements OnInit {
  name: any;
  visible: any;
  ejecutivos: IEjecutivo[] = [];
  $ejecutivos: IEjecutivo[] = [];
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

  seleccionarEjecutivo() {
    console.log(this.codEjec);
    if (this.codEjec) {
      const item = this.$ejecutivos.find(i => i.codUsuario == this.codEjec);
      if (item) {
        Swal.fire('Nueva Tarear', 'El ejecutivo ya esta seleccionado', 'warning');
        this.codEjec = null;
        return;
      } else {
        const obj = this.ejecutivos.find(c => c.codUsuario == this.codEjec);
        if (obj) {
          this.$ejecutivos.push(obj);
        }
      }
      this.codEjec = null;
    }
  }

  removeEjecutivo(item: IEjecutivo) {
    this.$ejecutivos = this.$ejecutivos.filter(i => i.codUsuario != item.codUsuario);
  }

  crear() {
    if (!this.name || !this.visible || this.$ejecutivos.length == 0) {
      Swal.fire('Nueva Tarear', 'Ingrese los datos obligatorios', 'warning');
      return;
    }
    console.log(this.name);
    console.log(this.visible);
    console.log(this.$ejecutivos);
  }
}
