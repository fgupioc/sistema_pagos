import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ya-pague',
  templateUrl: './ya-pague.component.html',
  styleUrls: ['./ya-pague.component.css']
})
export class YaPagueComponent implements OnInit {
  comment: string;
  info: any;

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
