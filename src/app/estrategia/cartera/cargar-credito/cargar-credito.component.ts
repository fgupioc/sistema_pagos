import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CarteraCargarCreditoFileComponent} from './file/file.component';
import {CreditoService} from '../../../servicios/estrategia/credito.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-cargar-credito',
  templateUrl: './cargar-credito.component.html',
  styleUrls: ['./cargar-credito.component.css']
})
export class CarteraCargarCreditoComponent implements OnInit {
  cargas = [];

  constructor(private modalService: NgbModal, private creditoService: CreditoService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.listarCargas();
  }

  listarCargas() {
    this.spinner.show();
    this.creditoService.listarCargas().subscribe(
      res => {
        this.spinner.hide();
        this.cargas = res;
      });
  }

  resetear() {

  }

  cargarArchivo() {
    const modal = this.modalService.open(CarteraCargarCreditoFileComponent, {centered: true});
    modal.result.then(this.modalClose.bind(this), this.modalClose.bind(this));
  }

  modalClose(response) {
    if (response) {
      this.listarCargas();
    }
  }

  ejecutarCarga() {

  }
}
