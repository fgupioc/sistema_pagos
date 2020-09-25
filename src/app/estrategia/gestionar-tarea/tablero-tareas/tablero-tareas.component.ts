import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalNuevaTareasComponent} from '../modal-nueva-tareas/modal-nueva-tareas.component';

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
    const modal = this.modalService.open(ModalNuevaTareasComponent, {centered: true});
  }
}
