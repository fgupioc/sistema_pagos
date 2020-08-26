import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-gestionar-promesas-pago',
  templateUrl: './modal-gestionar-promesas-pago.component.html',
  styles: []
})
export class ModalGestionarPromesasPagoComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
