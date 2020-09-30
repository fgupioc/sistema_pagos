import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalNuevaTareasComponent} from '../modal-nueva-tareas/modal-nueva-tareas.component';
import {ModalTableroNuevaTareaComponent} from '../modal-tablero-nueva-tarea/modal-tablero-nueva-tarea.component';

@Component({
  selector: 'app-tablero-tareas',
  templateUrl: './tablero-tareas.component.html',
  styleUrls: ['./tablero-tareas.component.css']
})
export class TableroTareasComponent implements OnInit {

  constructor(
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  showModalNuevaTarea() {
    const modal = this.modalService.open(ModalTableroNuevaTareaComponent, {centered: true});
  }
}
