import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {YaPagueComponent} from '../respuestas/ya-pague/ya-pague.component';

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
    public config: NgbModalConfig
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
}
