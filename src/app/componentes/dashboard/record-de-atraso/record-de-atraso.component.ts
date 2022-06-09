import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Cartera} from '../../../interfaces/cartera';
import {FUNC} from '../../../comun/FUNC';
import {UtilsFormats} from '../../../comun/utils-formats';
import {CarteraConAtrasoDetalleComponent} from '../modals/cartera-con-atraso-detalle/cartera-con-atraso-detalle.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-record-de-atraso',
  templateUrl: './record-de-atraso.component.html',
  styleUrls: ['./record-de-atraso.component.css']
})
export class RecordDeAtrasoComponent implements OnInit {
  pagosAtrasoDolar: any[] = [];
  pagosAtrasoSoles: any[] = [];
  pagosDiaDolar: any[] = [];
  pagosDiaSoles: any[] = [];

  selectCartera = 0;
  carteras: Cartera[] = [];

  alDia: any[] = [
    {label: '0 días', desde: 0, hasta: 0},
    {label: '1 a 3 días', desde: 1, hasta: 3},
    {label: '4 a 5 días', desde: 4, hasta: 5}
  ];
  atraso: any[] = [
    {label: '6 a 15 días', desde: 6, hasta: 15},
    {label: '16 a 30 días', desde: 16, hasta: 30},
    {label: '31 a 45 días', desde: 31, hasta: 45},
    {label: '46 a 60 días', desde: 46, hasta: 60},
    {label: '61 a 75 días', desde: 61, hasta: 75},
    {label: '76 a 85 días', desde: 76, hasta: 85},
    {label: '86 a 90 días', desde: 86, hasta: 90},
    {label: '91 a más', desde: 91, hasta: 10000}
  ];

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.listarCarteras();
    this.loadData(this.selectCartera);
  }

  loadData(carteraId: any) {
    this.spinner.show();
    this.dashboardService.getRecordAtraso(carteraId).subscribe(
      res => {
        this.pagosAtrasoDolar = res.pagosAtrasoDolar;
        this.pagosAtrasoSoles = res.pagosAtrasoSoles;
        this.pagosDiaDolar = res.pagosDiaDolar;
        this.pagosDiaSoles = res.pagosDiaSoles;
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  calcularInfo(items: any[], item: any) {
    let array = [];
    if (item.hasta != null) {
      array = items.filter(i => i.diasAtraso >= item.desde && i.diasAtraso <= item.hasta);
    } else {
      array = items.filter(i => i.diasAtraso >= item.desde && i.diasAtraso);
    }
    const value = array.length == 0 ? 0 : Object.values(array).reduce((t, {montoVigente}) => t + montoVigente, 0);
    return UtilsFormats.mostrarNumeroSimplificado(value);
  }
  private listarCarteras() {
    this.dashboardService.listarCarteras().subscribe(
      res => {
        this.carteras = res;
      }
    );
  }

  calcularInfoHover(items: any[], item: any): string {
    let array = [];
    if (item.hasta != null) {
      array = items.filter(i => i.diasAtraso >= item.desde && i.diasAtraso <= item.hasta);
    } else {
      array = items.filter(i => i.diasAtraso >= item.desde && i.diasAtraso);
    }
    return array.length == 0 ? 0 : FUNC.formatCurrency(Object.values(array).reduce((t, {montoVigente}) => t + montoVigente, 0), 2);
  }

  mostrarDetalle(moneda: any, item: any) {
    this.spinner.show();
    this.dashboardService.getRecorAtrasoCreditos(this.selectCartera, moneda, item.desde, item.hasta).subscribe(
      res => {
        const modalRef = this.modalService.open(CarteraConAtrasoDetalleComponent, {size: 'xl'});
        modalRef.componentInstance.creditos = res;
        this.spinner.hide();
      },
      err => this.spinner.show()
    );
  }
}
