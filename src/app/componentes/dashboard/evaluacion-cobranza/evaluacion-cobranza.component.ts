import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {CONST} from '../../../comun/CONST';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-evaluacion-cobranza',
  templateUrl: './evaluacion-cobranza.component.html',
  styleUrls: ['./evaluacion-cobranza.component.css']
})
export class EvaluacionCobranzaComponent implements OnInit {
  monSol = CONST.ENUM_MONEDA.SOL;
  monDolar = CONST.ENUM_MONEDA.DOLAR;

  clasificaciones: TablaMaestra[] = [];
  clasificacionesAbaco: any[] = [];
  clasificacionesCentralRiesgo: any[] = [];
  sumProyectada = 0.00;
  sumReal = 0.00;

  sumProyectadaD = 0.00;
  sumRealD = 0.00;

  constructor(
    private dashboardService: DashboardService,
    private maestroService: MaestroService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.loadClasificaciones();
    this.loadData();
  }


  private loadData() {
    this.spinner.show();
    this.dashboardService.getEvolucionCobranza().subscribe(
      res => {
        this.clasificacionesAbaco = res.clasificacionesAbaco;
        this.clasificacionesCentralRiesgo = res.clasificacionesCentralRiesgo;
        if (res.real.length > 0) {
          for (const i of res.real) {
            if (i.codigoMoneda == CONST.ENUM_MONEDA.SOL) {
              this.sumReal += i.total;
            }
            if (i.codigoMoneda == CONST.ENUM_MONEDA.DOLAR) {
              this.sumRealD += i.total;
            }
          }
        }
        if (res.proyectadas.length > 0) {
          for (const i of res.proyectadas) {
            if (i.codigoMoneda == CONST.ENUM_MONEDA.SOL) {
              this.sumProyectada += i.total;
            }
            if (i.codigoMoneda == CONST.ENUM_MONEDA.DOLAR) {
              this.sumProyectadaD += i.total;
            }
          }
        }
        this.spinner.hide();
      },
      error => this.spinner.hide()
    );
  }

  private loadClasificaciones() {
    this.maestroService.listarElementosPorCodTable(CONST.TABLE_STR_LISTA_TIPO_CLASIFICACIONES).subscribe(
      res => this.clasificaciones = res
    );
  }

  getDataArray(items: any[], moneda: any): any[] {
    let array: any[] = [];
    const soles: any[] = items.filter(i => i.codMoneda == moneda);
    if (this.clasificaciones.length > 0) {
      for (const c of this.clasificaciones) {
        const item = soles.find(i => i.codClasificacion == c.codItem);
        array.push(
          {
            value: 100 / this.clasificaciones.length,
            code: item ? item.codClasificacion : null,
            class: c.strValor,
            label: c.descripcion,
            total: item ? item.total : 0
          },
        );
      }
    }
    return array;
  }

}
