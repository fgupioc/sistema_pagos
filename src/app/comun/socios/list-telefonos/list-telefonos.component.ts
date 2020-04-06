import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TelefonoService} from '../../../servicios/telefono.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-socio-list-telefonos',
  templateUrl: './list-telefonos.component.html',
  styleUrls: ['./list-telefonos.component.css']
})
export class SocioListTelefonosComponent implements OnInit {
  telefonos = [];
  socioId = 0;

  constructor(public activeModal: NgbActiveModal, private telefonoService: TelefonoService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.spinner.show();
    this.telefonoService.porSocioId(this.socioId).subscribe(
      res => {
        this.spinner.hide();
        this.telefonos = res;
      });
  }
}
