import { Component, OnInit } from '@angular/core';
import { TablaMaestra } from '../../../interfaces/tabla-maestra';
import { MaestroService } from '../../../servicios/sistema/maestro.service';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';

@Component({
  selector: 'app-comportamiento-de-pago',
  templateUrl: './comportamiento-de-pago.component.html',
  styleUrls: ['./comportamiento-de-pago.component.css']
})
export class ComportamientoDePagoComponent implements OnInit {
  productos: any[] = [];
  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.listarProductosAbaco();
  }

  private listarProductosAbaco() {
    this.dashboardService.getComportamientoPago().subscribe(
      res => {
        if (res.resulset) {
          this.productos = res.resulset;
        }
      }
    );
  }

  calcularPorcentaje(cant: any, total: any) {
    return total == 0 ? 0 : (cant * 100) / total;
  }
}
