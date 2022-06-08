import {Component, Input, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {FUNC} from '../../../comun/FUNC';
import {UtilsFormats} from '../../../comun/utils-formats';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalModule} from 'ngx-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CarteraConAtrasoDetalleComponent} from '../modals/cartera-con-atraso-detalle/cartera-con-atraso-detalle.component';
import {CreditosEstadoCarteraComponent} from './creditos-estado-cartera/creditos-estado-cartera.component';
import {Cartera} from '../../../interfaces/cartera';

@Component({
  selector: 'app-chart-estado-cartera',
  templateUrl: './chart-estado-cartera.component.html',
  styleUrls: ['./chart-estado-cartera.component.css']
})
export class ChartEstadoCarteraComponent implements OnInit {
  @Input() title: string;
  @Input() cartera: Cartera;
  @Input() dataChart: any;
  @Input() year: any[];
  @Input() moneda: string;
  @Input() codCartera: number;

  public barChartOptions: any = {
    responsive: true,
    hover: {
      mode: 'nearest'
    },
    interaction: {
      mode: 'nearest',
    },
    legend: {position: 'right'},
    title: {
      display: true,
      text: 'Soles (Miles)'
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const label = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = tooltipItem.value || 0.00;
          // return label + ' ' +  FUNC.formatCurrency(Number(value), 2) ;
          return label + ' ' + FUNC.formatCurrency(Number(value), 2);
        }
      }
    },
    scales: {
      xAxes: [],
      yAxes: [
        {
          ticks: {
            fontColor: '#000',
            fontSize: 12,
            callback: (value, index, labels) => {
              // return FUNC.formatCurrency(value, 2);
              return UtilsFormats.mostrarNumeroSimplificado(value);
            }
          }
        }
      ]
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return FUNC.formatCurrency(Number(value), 2);
        },
        anchor: 'center',
        align: 'center',
        color: 'black',
        font: {
          weight: 'bold',
          size: 12,
        }
      }
    }
  };
  public barChartLabels: any[] = [];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartPlugins: any = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    {data: [], label: 'Con atraso', stack: 'a', backgroundColor: '#ff6384', barPercentage: 0.3},
    {data: [], label: 'Al día', stack: 'a', backgroundColor: '#36a2eb', barPercentage: 0.3}
  ];

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.barChartOptions.title.text = this.title;
    if (this.dataChart && this.barChartData.length) {
      this.barChartLabels = this.year;
      this.barChartData[0].data = this.dataChart.atraso;
      this.barChartData[1].data = this.dataChart.dia;
    }

  }

  // events
  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const index = e.active[0]._datasetIndex;
      const legends = e.active[0]._chart.legend.legendItems;
      const label = legends[index].text;
      if (index == 1) {
        this.listarCreditosAlDia();
      }
      if (index == 0) {
        this.listarCreditosConAtraso();
      }
    }
  }

  public chartHovered(e: any): void {
  }

  listarCreditosAlDia() {
    this.spinner.show();
    this.dashboardService.listarDetalleCreditosAldia(this.codCartera, this.moneda).subscribe(
      res => {
        this.spinner.hide();
        const modalRef = this.modalService.open(CreditosEstadoCarteraComponent, {size: 'xl'});
        modalRef.componentInstance.creditos = res.creditos;
        modalRef.componentInstance.titulo = 'Lista de créditos al día - ' + ( this.moneda == 'PEN' ? 'Soles' : 'Dolares') ;
        modalRef.componentInstance.subtitulo = 'Cartera: ' + ( this.codCartera == 0 ? 'Todas' : this.cartera.nombre);
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  listarCreditosConAtraso() {
    this.spinner.show();
    this.dashboardService.listarDetalleCreditosConAtraso(this.codCartera, this.moneda).subscribe(
      res => {
        this.spinner.hide();
        const modalRef = this.modalService.open(CreditosEstadoCarteraComponent, {size: 'xl'});
        modalRef.componentInstance.creditos = res.creditos;
        modalRef.componentInstance.titulo = 'Lista de créditos con atraso - ' + ( this.moneda == 'PEN' ? 'Soles' : 'Dolares') ;
        modalRef.componentInstance.subtitulo = 'Cartera: ' + ( this.codCartera == 0 ? 'Todas' : this.cartera.nombre);
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
