import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-gestionar-tarea',
  templateUrl: './modal-gestionar-tarea.component.html',
  styles: []
})
export class ModalGestionarTareaComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
