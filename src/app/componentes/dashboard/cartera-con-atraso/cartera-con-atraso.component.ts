import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import has = Reflect.has;
import {NgxSpinnerService} from 'ngx-spinner';
import {Cartera} from '../../../interfaces/cartera';

@Component({
  selector: 'app-cartera-con-atraso',
  templateUrl: './cartera-con-atraso.component.html',
  styleUrls: ['./cartera-con-atraso.component.css']
})
export class CarteraConAtrasoComponent implements OnInit {

  saldosCapital: any[] = [];
  sectores: any[] = ['001', '002', '003'];
  chartSoles: any[] = [];
  chartDolar: any[] = [];
  divisionDolar: any[] = [];
  divisionSoles: any[] = [];
  diasAtrasoCarterasDolar: any[] = [];
  diasAtrasoCarterasSoles: any[] = [];
  selectCartera: any;
  carteras: Cartera[] = [];

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.listarCarteras();
    this.saldosCapital.push(
      {desde: 1, hasta: 1000},
      {desde: 1001, hasta: 5000},
      {desde: 5001, hasta: 10000},
      {desde: 10001, hasta: 25000},
      {desde: 25001, hasta: 50000},
      {desde: 50001, hasta: 75000},
      {desde: 75001, hasta: 100000},
      {desde: 1000001, hasta: null}
    );
  }


  private loadData(carteraId: any) {
    this.chartDolar = [];
    this.chartSoles = [];
    this.spinner.show();
    this.dashboardService.getCarteraConAtraso(carteraId).subscribe(
      res => {
        if (res.chartDolar) {
          this.chartDolar = [res.chartDolar.yellowCantidad, res.chartDolar.orangeCantidad, res.chartDolar.redCantidad];
        }

        if (res.chartSoles) {
          this.chartSoles = [res.chartSoles.yellowCantidad, res.chartSoles.orangeCantidad, res.chartSoles.redCantidad];
        }
        this.divisionSoles = res.divisionSoles;
        this.divisionDolar = res.divisionDolar;
        this.diasAtrasoCarterasSoles = res.diasAtrasoCarterasSoles;
        this.diasAtrasoCarterasDolar = res.diasAtrasoCarterasDolar;
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  calcularInfo(items: any[], item: any, desde: any, hasta: any) {
    let result = [];
    if (item.hasta != null) {
      if (hasta != null) {
        result = items.filter(i => i.saldoCapital >= item.desde && i.saldoCapital <= item.hasta && i.diasAtraso >= desde && i.diasAtraso <= hasta);
      } else {
        result = items.filter(i => i.saldoCapital >= item.desde && i.saldoCapital <= item.hasta && i.diasAtraso >= desde);
      }
    } else {
      if (hasta != null) {
        result = items.filter(i => i.saldoCapital >= item.desde && i.diasAtraso >= desde && i.diasAtraso <= hasta);
      } else {
        result = items.filter(i => i.saldoCapital >= item.desde && i.diasAtraso >= desde);
      }
    }
    return result.length;
  }

  calcularSector(items: any[], item: any, desde: any, hasta: any) {
    let result = [];
    if (hasta != null) {
      result  = items.filter(i => i.codigoSectorEconomico == item && i.diasAtraso >= desde && i.diasAtraso <= hasta);
    } else {
      result  = items.filter(i => i.codigoSectorEconomico == item && i.diasAtraso >= desde);
    }
    return result.length;
  }

  private listarCarteras() {
    this.dashboardService.listarCarteras().subscribe(
      res => {
        this.carteras = res;
        if (this.carteras.length > 0) {
          this.selectCartera = this.carteras[0].codCartera;
          this.loadData(this.selectCartera);
        }
      }
    );
  }
}
