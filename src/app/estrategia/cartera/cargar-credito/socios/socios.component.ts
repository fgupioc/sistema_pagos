import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreditoService} from '../../../../servicios/estrategia/credito.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-cartera-cargar-credito-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class CarteraCargarCreditoSociosComponent implements OnInit {
  socios = [];

  constructor(private router: Router, private creditoService: CreditoService, private spinner: NgxSpinnerService,
              private rutaActiva: ActivatedRoute) {
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
}
