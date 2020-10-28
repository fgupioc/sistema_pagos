import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {YaPagueComponent} from '../respuestas/ya-pague/ya-pague.component';
import {LlamenmeComponent} from '../respuestas/llamenme/llamenme.component';
import {UbigeoService} from '../../../servicios/sistema/ubigeo.service';
import {ReclamoComponent} from '../respuestas/reclamo/reclamo.component';
import {CompromisoPagoComponent} from '../respuestas/compromiso-pago/compromiso-pago.component';
import {SocioInvitadoService} from '../../../servicios/socio/socio-invitado.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-socio-credito-detalle',
  templateUrl: './socio-credito-detalle.component.html',
  styleUrls: ['./../socio-creditos/socio-creditos.component.css']
})

export class SocioCreditoDetalleComponent implements OnInit {
  token: string;
  numCredito: string;
  socio: any;
  credito: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    public config: NgbModalConfig,
    private ubigeoService: UbigeoService,
    private socioInvitadoService: SocioInvitadoService,
    private spinner: NgxSpinnerService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    activatedRoute.params.subscribe(({token, numCredito}) => {
      this.token = token;
      this.numCredito = numCredito;
    });
  }

  ngOnInit() {
    if (this.token && this.numCredito) {
      this.loadCreadito();
    }
  }

  loadCreadito() {
    this.spinner.show();
    this.socioInvitadoService.obtenerCredito(this.token, this.numCredito).subscribe(
      res => {
        if (res.exito) {
          this.socio = res.socio;
          this.credito = res.objeto;
          this.spinner.hide();
        } else {
          this.router.navigateByUrl('/socio/mis-creditos/' + this.token);
        }
      },
      err => {
        this.router.navigateByUrl('/socio/mis-creditos/' + this.token);
      }
    );
  }

  showModalYaPague() {
    const modal = this.modalService.open(YaPagueComponent, {centered: true});
    modal.componentInstance.info = this.ubigeoService.info;
    modal.componentInstance.token = this.token;
    modal.componentInstance.numCredito = this.numCredito;
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
    modal.componentInstance.token = this.token;
    modal.componentInstance.numCredito = this.numCredito;
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
    modal.componentInstance.token = this.token;
    modal.componentInstance.numCredito = this.numCredito;
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
    modal.componentInstance.token = this.token;
    modal.componentInstance.numCredito = this.numCredito;
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
