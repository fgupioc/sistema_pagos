import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalNuevaTareasComponent} from '../modal-nueva-tareas/modal-nueva-tareas.component';
import {ModalTableroNuevaTareaComponent} from '../modal-tablero-nueva-tarea/modal-tablero-nueva-tarea.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tablero-tareas',
  templateUrl: './tablero-tareas.component.html',
  styleUrls: ['./tablero-tareas.component.css']
})
export class TableroTareasComponent implements OnInit {

  ejecutivos: any[] = [];
  constructor(
    public modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.listarEjecutivos();
  }

  showModalNuevaTarea() {
    const modal = this.modalService.open(ModalTableroNuevaTareaComponent, {centered: true});
  }

  listarEjecutivos() {
    this.asignacionService.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
          console.log(this.ejecutivos);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
