import { Component, OnInit } from '@angular/core';
import { CONST } from '../comun/CONST';
import { EstadosCartera, GrupoCartera } from '../interfaces/dashboard/estados-cartera';
import { DashboardService } from '../servicios/dashboard/dashboard.service';
import {MaestroService} from '../servicios/sistema/maestro.service';
import {TablaMaestra} from '../interfaces/tabla-maestra';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  carteras: GrupoCartera[] = [];
  sol: any;
  dolar: any;
  year: number[] = [];
  productos: TablaMaestra[] = [];
  constructor(
    private dashboardService: DashboardService,
    private maestroService: MaestroService
  ) { }

  ngOnInit() {
    this.listarProductosAbaco();
    this.loadEstadoCarteras();
  }

  loadEstadoCarteras() {
    this.dashboardService.getEstadoLasCarteras().subscribe(
      res => {
        this.carteras = res.carteras;
        if (this.carteras.length > 0) {
          const item: GrupoCartera = this.carteras[0];
          const sol = item.items.find(i => i.codMoneda == CONST.ENUM_MONEDA.SOL);
          const dolar = item.items.find(i => i.codMoneda == CONST.ENUM_MONEDA.DOLAR);
          this.year.push(item.year);
          this.sol = {
            atraso: sol? [sol.atraso.toFixed(2)]: [] ,
            dia: sol ? [sol.dia.toFixed(2)] : [],
          };

          this.dolar = {
            atraso: dolar ? [dolar.atraso.toFixed(2)] : [],
            dia: dolar ? [dolar.dia.toFixed(2)] : [],
          };
        }
      }
    );
  }


  private listarProductosAbaco() {
    this.maestroService.listaTablaProductoAbaco().subscribe(
      res => {
        this.productos =  res;
      }
    );
  }
}
