import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gestores-negocio-modal',
  templateUrl: './gestores-negocio-modal.component.html',
  styleUrls: ['./gestores-negocio-modal.component.css']
})
export class GestoresNegocioModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
