import {Component, Input, OnInit} from '@angular/core';
import {CarteraConAtrasoDetalleComponent} from '../modals/cartera-con-atraso-detalle/cartera-con-atraso-detalle.component';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chart-cartera-con-atraso',
  templateUrl: './chart-cartera-con-atraso.component.html',
  styleUrls: ['./chart-cartera-con-atraso.component.css']
})
export class ChartCarteraConAtrasoComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() divisiones: any[] = [];
  @Input() title = '';
  @Input() moneda;

  public barChartOptions: any = {
    responsive: true,
    legend: {position: 'right'},
    title: {
      display: true,
      text: ''
    },
    plugins: {
      datalabels: {
        color: 'white',
      }
    },
    hover: {
      mode: 'nearest'
    },
    interaction: {
      mode: 'nearest',
    },
  };


  // Pie
  public pieChartLabels: string[] = ['0 - 15 días', '16 - 30 días', '31 a más días'];
  public pieChartData: any[] = [];
  public pieChartType: any = 'pie';
  lineChartColours: Array<any> = [{
    backgroundColor: ['#ffea00', '#ff9600', '#dc3545']
  }];


  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.barChartOptions.title.text = this.title + ' (Miles)';
    if (this.data.length > 0) {
      this.pieChartData = this.data;
    }
  }

  // events
  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const items = [
        {
          desde: 0,
          hasta: 15,
        },
        {
          desde: 16,
          hasta: 30,
        },
        {
          desde: 31,
          hasta: 20000,
        }
      ];
      const legends = e.active[0]._chart.legend.legendItems;
      const index = e.active[0]._index;
      this.mostrarDetalle(items[index].desde, items[index].hasta);
    }
  }

  mostrarDetalleDivision(division: any, desde: number, hasta: number) {
    this.spinner.show();
    this.dashboardService.getCarteraConAtrasoSectorEconomicoDetalleDivision(this.moneda, division.codigoTipoDivision, desde, hasta).subscribe(
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

  mostrarDetalle( desde: number, hasta: number) {
    this.spinner.show();
    this.dashboardService.getCarteraConAtrasoSectorEconomicoDetalle(this.moneda, desde, hasta).subscribe(
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
