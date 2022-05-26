import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import has = Reflect.has;
import {NgxSpinnerService} from 'ngx-spinner';
import {Cartera} from '../../../interfaces/cartera';
import {CONST} from '../../../comun/CONST';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CarteraConAtrasoDetalleComponent} from '../modals/cartera-con-atraso-detalle/cartera-con-atraso-detalle.component';

@Component({
  selector: 'app-cartera-con-atraso',
  templateUrl: './cartera-con-atraso.component.html',
  styleUrls: ['./cartera-con-atraso.component.css']
})
export class CarteraConAtrasoComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  saldosCapital: any[] = [];
  sectores: any[] = ['001', '002', '003'];
  chartSoles: any[] = [];
  chartDolar: any[] = [];
  divisionDolar: any[] = [];
  divisionSoles: any[] = [];
  diasAtrasoCarterasDolar: any[] = [];
  diasAtrasoCarterasSoles: any[] = [];
  selectCartera = 0;
  carteras: Cartera[] = [];
  $dolares: any[] = [];
  $soles: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
    this.dtOptions.order = [[0, 'asc']];
    this.listarCarteras();
    this.loadData(this.selectCartera);
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


  loadData(carteraId: any) {
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

    this.dashboardService.getCarteraConAtrasoSectorEconomico(carteraId).subscribe(
      res => {
        if (res && res.exito) {
          this.$dolares = res.dolares;
          this.$soles = res.soles;
        }
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
      result = items.filter(i => i.codigoSectorEconomico == item && i.diasAtraso >= desde && i.diasAtraso <= hasta);
    } else {
      result = items.filter(i => i.codigoSectorEconomico == item && i.diasAtraso >= desde);
    }
    return result.length;
  }

  private listarCarteras() {
    this.dashboardService.listarCarteras().subscribe(
      res => {
        this.carteras = res;
      }
    );
  }

  getCantidad(nivel: string, index: any) {
    if (index && nivel == index.nivel) {
      return index.cantidad;
    }
    return 0;
  }

  mostrarDetalleSaldo(moneda: string, desde: number, hasta: number, item: any) {
    this.spinner.show();
    this.dashboardService.getcarteraConAtrasoSectorEconomicoDetalleSalso(this.selectCartera, item.desde, item.hasta ? item.hasta : 0 , moneda, desde, hasta).subscribe(
      res => {
        this.spinner.hide();
        const modalRef = this.modalService.open(CarteraConAtrasoDetalleComponent, {size: 'xl'});
        modalRef.componentInstance.creditos = res;
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  mostrarDetalleSector(moneda: string, index: any, nivel: string, desde: number, hasta: number) {
    if (index && nivel == index.nivel && Number(index.cantidad) > 0) {
      const data = {
        sector: index.codSector,
        desde,
        hasta,
        moneda
      };
      this.spinner.show();
      this.dashboardService.getCarteraConAtrasoSectorEconomicoDetalleDiasAtraso(this.selectCartera, data.moneda, data.sector, data.desde, data.hasta).subscribe(
        res => {
          this.spinner.hide();
          const modalRef = this.modalService.open(CarteraConAtrasoDetalleComponent, {size: 'xl'});
          modalRef.componentInstance.creditos = res;
        },
        err => {
          this.spinner.hide();
        }
      );
    }
  }

}
