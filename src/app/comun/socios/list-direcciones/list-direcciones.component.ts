import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DireccionService} from '../../../servicios/direccion.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-socio-list-direcciones',
  templateUrl: './list-direcciones.component.html',
  styleUrls: ['./list-direcciones.component.css']
})
export class SocioListDireccionesComponent implements OnInit {
  direcciones = [];
  socioId = 0;

  constructor(public activeModal: NgbActiveModal, private direccionService: DireccionService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.spinner.show();
    this.direccionService.porSocioId(this.socioId).subscribe(
      res => {
        this.spinner.hide();
        this.direcciones = res;
      });
  }

}
