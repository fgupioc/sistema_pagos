import {Component, NgZone, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-llamenme',
  templateUrl: './llamenme.component.html',
  styleUrls: ['./llamenme.component.css']
})
export class LlamenmeComponent implements OnInit {
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
