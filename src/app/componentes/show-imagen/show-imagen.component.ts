import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-imagen',
  templateUrl: './show-imagen.component.html',
  styleUrls: ['./show-imagen.component.css']
})
export class ShowImagenComponent implements OnInit {
  url: string;

  constructor(
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
  }

}
