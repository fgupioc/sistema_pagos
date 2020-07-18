import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreditoService} from '../../../../servicios/estrategia/credito.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SocioListDireccionesComponent} from '../../../../comun/socios/list-direcciones/list-direcciones.component';
import {SocioListEmailsComponent} from '../../../../comun/socios/list-emails/list-emails.component';
import {SocioListTelefonosComponent} from '../../../../comun/socios/list-telefonos/list-telefonos.component';

@Component({
  selector: 'app-cartera-cargar-credito-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class CarteraCargarCreditoSociosComponent implements OnInit {
  socios = [];

  constructor(private router: Router, private creditoService: CreditoService, private spinner: NgxSpinnerService,
              private rutaActiva: ActivatedRoute, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.sociosPorCargaCredito(this.rutaActiva.snapshot.params.cargaCreditoId);
  }

  sociosPorCargaCredito(cargaCreditoId: number) {
    this.spinner.show();
    this.creditoService.sociosPorCargaCredito(cargaCreditoId).subscribe(
      res => {
        this.spinner.hide();
        this.socios = res;
      });
  }

  regresar() {
    this.router.navigate(['/auth/estrategia/cartera/cargar-credito']);
  }

  direcciones(socioId: number) {
    const modal = this.modalService.open(SocioListDireccionesComponent, {centered: true});
    modal.componentInstance.socioId = socioId;
  }

  telefonos(socioId: number) {
    const modal = this.modalService.open(SocioListTelefonosComponent, {centered: true});
    modal.componentInstance.socioId = socioId;
  }

  emails(socioId: number) {
    this.spinner.show();
    const modal = this.modalService.open(SocioListEmailsComponent, {centered: true});
    modal.componentInstance.socioId = socioId;
  }
}
