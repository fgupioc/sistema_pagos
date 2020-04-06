import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-socio-list-direcciones',
  templateUrl: './list-direcciones.component.html',
  styleUrls: ['./list-direcciones.component.css']
})
export class SocioListDireccionesComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,) { }

  ngOnInit() {
  }

}
