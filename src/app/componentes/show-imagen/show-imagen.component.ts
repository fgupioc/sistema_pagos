import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-show-imagen',
  templateUrl: './show-imagen.component.html',
  styleUrls: ['./show-imagen.component.css']
})
export class ShowImagenComponent implements OnInit {
  url: string;
  urlApi = environment.signinUrl;
  tipo: any;
  id: any;

  constructor(
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
  }

}
