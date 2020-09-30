import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-nueva-tareas',
  templateUrl: './modal-nueva-tareas.component.html',
  styleUrls: ['./modal-nueva-tareas.component.css']
})

export class ModalNuevaTareasComponent implements OnInit {
  name: any;
  tarea: any;
  showActividades = false;
  editDescription = false;
  editVencimiento = false;
  checkVencimiento: any;

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
  }


  crear() {

  }

  changeVencimiento(event: any) {
    console.log(event);
  }

  newVencimiento() {
    if (!this.tarea.fechaVencimiento) {
      this.tarea.fechaVencimiento = moment(new Date()).format('YYYY-MM-DD');
      this.tarea.fechaHora = moment(new Date()).format('HH:mm');
    } else {
      this.tarea.fechaVencimiento = moment(this.tarea.fechaVencimiento).format('YYYY-MM-DD');
    }
    this.editVencimiento = true;
  }

  get checedCumplido() {
    if (this.estaFechaVencida() && !this.checkVencimiento) {
      return 2;
    } else if (this.checkVencimiento) {
      return 1;
    } else {
      return 0;
    }
  }

  estaFechaVencida() {
    return moment().isAfter(moment(this.tarea.fechaVencimiento).format('YYYY-MM-DD'));
  }
}
