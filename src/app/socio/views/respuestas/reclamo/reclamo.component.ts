import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.css']
})
export class ReclamoComponent implements OnInit {

  info: any;
  comment: string;

  constructor(
      public activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit() {
  }

  enviar() {
    console.log(this.comment);
  }


}
