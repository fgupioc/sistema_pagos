import { Component, OnInit } from '@angular/core';
import { CONST } from 'src/app/comun/CONST';
import { GrupoCartera } from '../../../interfaces/dashboard/estados-cartera';
import { DashboardService } from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-estado-cartera',
  templateUrl: './estado-cartera.component.html',
  styleUrls: ['./estado-cartera.component.css']
})
export class EstadoCarteraComponent implements OnInit {

  carteras: GrupoCartera[] = [];
  sol: any;
  dolar: any;
  year: number[] = [];
  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loadEstadoCarteras();
  }

  loadEstadoCarteras() {
    this.spinner.show();
    this.dashboardService.getEstadoLasCarteras().subscribe(
      res => {
        this.carteras = res.carteras;
        if (this.carteras.length > 0) {
          const item: GrupoCartera = this.carteras[0];
          const sol = item.items.find(i => i.codMoneda == CONST.ENUM_MONEDA.SOL);
          const dolar = item.items.find(i => i.codMoneda == CONST.ENUM_MONEDA.DOLAR);
          this.year.push(item.year);
          this.sol = {
            atraso: sol ? [sol.atraso.toFixed(2)] : [],
            dia: sol ? [sol.dia.toFixed(2)] : [],
          };

          this.dolar = {
            atraso: dolar ? [dolar.atraso.toFixed(2)] : [],
            dia: dolar ? [dolar.dia.toFixed(2)] : [],
          };
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

}
