import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {Cartera} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-comportamiento-de-pago',
  templateUrl: './comportamiento-de-pago.component.html',
  styleUrls: ['./comportamiento-de-pago.component.css']
})
export class ComportamientoDePagoComponent implements OnInit {
  carteras: Cartera[] = [];
  productos: any[] = [];
  selectCartera: any;
  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.listarCarteras();
  }

  listarProductosAbaco(carteraId: any) {
    this.spinner.show();
    this.dashboardService.getComportamientoPago(carteraId).subscribe(
      res => {
        if (res.resulset) {
          this.productos = res.resulset;
          this.spinner.hide();
        }
      },
      err => this.spinner.hide()
    );
  }

  calcularPorcentaje(cant: any, total: any) {
    return total == 0 ? 0 : ((cant * 100) / total).toFixed(2);
  }

  private listarCarteras() {
    this.dashboardService.listarCarteras().subscribe(
      res => {
        this.carteras = res;
        if (this.carteras.length > 0) {
          this.selectCartera = this.carteras[0].codCartera;
          this.listarProductosAbaco(this.selectCartera);
        }
      }
    );
  }
}
