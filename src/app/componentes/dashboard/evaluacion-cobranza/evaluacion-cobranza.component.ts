import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {CONST} from '../../../comun/CONST';

@Component({
  selector: 'app-evaluacion-cobranza',
  templateUrl: './evaluacion-cobranza.component.html',
  styleUrls: ['./evaluacion-cobranza.component.css']
})
export class EvaluacionCobranzaComponent implements OnInit {

  clasificaciones: TablaMaestra[] = [];

  clasificacionesAbaco: any[] = [];
  clasificacionesCentralRiesgo: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private maestroService: MaestroService
  ) {
  }

  ngOnInit(): void {
    this.loadClasificaciones();
    this.loadData();
  }


  private loadData() {
    this.dashboardService.getEvolucionCobranza().subscribe(
      res => {
        this.clasificacionesAbaco = res.clasificacionesAbaco;
        this.clasificacionesCentralRiesgo = res.clasificacionesCentralRiesgo;
      }
    );
  }

  private loadClasificaciones() {
    this.maestroService.listarElementosPorCodTable(CONST.TABLE_STR_LISTA_TIPO_CLASIFICACIONES).subscribe(
      res => this.clasificaciones = res
    );
  }

  getSoles(items: any[]): any[] {
    let array: any[] = [];
    const soles: any[] = items.filter(i => i.codMoneda == CONST.ENUM_MONEDA.SOL);
    for (const item of soles) {
      array.push(
        {
          value: 100 / soles.length,
          code: item.codClasificacion,
          class: this.getClass(item.codClasificacion),
          label: this.getNameClass(item.codClasificacion),
          total: item.total
        },
      );
    }
    return array;
  }

  getDolare(items: any[]): any[] {
    let array: any[] = [];
    const dolares: any[] = items.filter(i => i.codMoneda == CONST.ENUM_MONEDA.DOLAR);
    for (const item of dolares) {
      array.push(
        {
          value: 100 / dolares.length,
          code: item.codClasificacion,
          class: this.getClass(item.codClasificacion),
          label: this.getNameClass(item.codClasificacion),
          total: item.total
        },
      );
    }
    return array;
  }

  getNameClass(code: string) {
    if (this.clasificaciones.length == 0) {
      return '';
    }
    const item = this.clasificaciones.find(i => i.codItem == code);
    return item.descripcion || '';
  }

  getClass(code: string) {
    if (this.clasificaciones.length == 0) {
      return '';
    }
    const item = this.clasificaciones.find(i => i.codItem == code);
    return item.strValor || '';
  }
}
