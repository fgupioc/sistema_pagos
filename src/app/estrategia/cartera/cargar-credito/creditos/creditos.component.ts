import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreditoService} from '../../../../servicios/estrategia/credito.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-cartera-cargar-credito-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css']
})
export class CarteraCargarCreditoCreditosComponent implements OnInit {
  cretidosTemps = [];

  constructor(private router: Router, private creditoService: CreditoService, private spinner: NgxSpinnerService,
              private rutaActiva: ActivatedRoute) {
  }

  ngOnInit() {
    this.listarCreditoTemps(this.rutaActiva.snapshot.params.cargaCreditoId);
  }

  listarCreditoTemps(cargaCreditoId: number) {
    this.spinner.show();
    this.creditoService.listarCreditoTemps(cargaCreditoId).subscribe(
      res => {
        this.spinner.hide();
        this.cretidosTemps = res;
      });
  }

  regresar() {
    this.router.navigate(['/auth/estrategia/cartera/cargar-credito']);
  }
}
