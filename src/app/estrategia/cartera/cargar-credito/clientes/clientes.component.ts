import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreditoService} from '../../../../servicios/estrategia/credito.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-cartera-cargar-credito-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class CarteraCargarCreditoClientesComponent implements OnInit {
  clientes = [];

  constructor(private router: Router, private creditoService: CreditoService, private spinner: NgxSpinnerService,
              private rutaActiva: ActivatedRoute) {
  }

  ngOnInit() {
    this.clientesPorCargaCredito(this.rutaActiva.snapshot.params.cargaCreditoId);
  }

  clientesPorCargaCredito(cargaCreditoId: number) {
    this.spinner.show();
    this.creditoService.clientesPorCargaCredito(cargaCreditoId).subscribe(
      res => {
        this.spinner.hide();
        this.clientes = res;
      });
  }

  regresar() {
    this.router.navigate(['/auth/estrategia/cartera/cargar-credito']);
  }
}
