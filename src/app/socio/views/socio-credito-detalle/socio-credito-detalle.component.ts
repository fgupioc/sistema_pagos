import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {YaPagueComponent} from '../respuestas/ya-pague/ya-pague.component';
import {LlamenmeComponent} from '../respuestas/llamenme/llamenme.component';
import {UbigeoService} from '../../../servicios/sistema/ubigeo.service';
import {ReclamoComponent} from '../respuestas/reclamo/reclamo.component';
import {CompromisoPagoComponent} from '../respuestas/compromiso-pago/compromiso-pago.component';

@Component({
  selector: 'app-socio-credito-detalle',
  templateUrl: './socio-credito-detalle.component.html',
  styleUrls: ['./../socio-creditos/socio-creditos.component.css']
})

export class SocioCreditoDetalleComponent implements OnInit {
  token: string;
  numCredito: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    public config: NgbModalConfig,
    private ubigeoService: UbigeoService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    activatedRoute.params.subscribe(({token, numCredito}) => {
      this.token = token;
      this.numCredito = numCredito;
    });
  }

  ngOnInit() {
    console.log(this.token);
    console.log(this.numCredito);
  }


  showModalYaPague() {
    const modal = this.modalService.open(YaPagueComponent, {centered: true});
    modal.componentInstance.info = this.ubigeoService.info;
    modal.result.then(
      this.closeModalYapague.bind(this),
      this.closeModalYapague.bind(this)
    );
  }

  closeModalYapague(data) {
    if (data) {
      console.log(data);
    }
  }

  showModalLlamenme() {
    const modal = this.modalService.open(LlamenmeComponent, {centered: true});
    modal.componentInstance.info = this.ubigeoService.info;
    modal.result.then(
      this.closeModalLlamenme.bind(this),
      this.closeModalLlamenme.bind(this)
    );
  }

  closeModalLlamenme(data) {
    if (data) {
      console.log(data);
    }
  }

  showModalReclamo() {
    const modal = this.modalService.open(ReclamoComponent, {centered: true});
    modal.componentInstance.info = this.ubigeoService.info;
    modal.result.then(
      this.closeModalReclamo.bind(this),
      this.closeModalReclamo.bind(this)
    );
  }

  closeModalReclamo(data) {
    if (data) {
      console.log(data);
    }
  }

  showModalCompromisoPago() {
    const modal = this.modalService.open(CompromisoPagoComponent, {centered: true});
    modal.componentInstance.info = this.ubigeoService.info;
    modal.result.then(
      this.closeModalCompromisoPago.bind(this),
      this.closeModalCompromisoPago.bind(this)
    );
  }

  closeModalCompromisoPago(data) {
    if (data) {
      console.log(data);
    }
  }
}
