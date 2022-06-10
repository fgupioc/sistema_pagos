import {Component, Input, OnInit} from '@angular/core';
import {Color} from 'ng2-charts';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalMotivoDeAtrasoDetalleComponent} from '../motivo-de-atraso/modal-motivo-de-atraso-detalle/modal-motivo-de-atraso-detalle.component';

@Component({
  selector: 'app-chart-contactabilidad',
  templateUrl: './chart-contactabilidad.component.html',
  styleUrls: ['./chart-contactabilidad.component.css']
})
export class ChartContactabilidadComponent implements OnInit {
  @Input() pieChartData: any[] = [];
  @Input() title = '';
  @Input() carteraId: number;
  @Input() moneda: string;
  @Input() fecha: string;

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
      display: false,
      text: ''
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          const dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map(data => {
            sum += data;
          });
          return (value * 100 / sum).toFixed(0) + '%';
        },
        color: '#fff',
      }
    },

  };

  // Pie
  public pieChartLabels: string[] = ['Contados', 'No contactados', 'No respondieron'];
  public pieChartType: any = 'pie';
  lineChartColours: Array<any> = [{
    backgroundColor: ['#4dbd74', '#20a8d8', '#dc3545']
  }];


  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.barChartOptions.title.text = this.title + ' (Miles)';
  }

  // events
  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const index = e.active[0]._index;
      const legends = e.active[0]._chart.legend.legendItems;
      const label = legends[index].text;
      this.obtenerDatos(index);
    }
  }

  obtenerDatos(index) {
    this.spinner.show();
    this.dashboardService.getContactabilidadCreditos(this.carteraId, this.fecha, this.moneda, index).subscribe(
      res => {
        console.log(res);
        const modalRef = this.modalService.open(ModalMotivoDeAtrasoDetalleComponent, {size: 'xl'});
        modalRef.componentInstance.creditos = res.creditos;
        modalRef.componentInstance.respuesta = {descripcion: 'Lista de Socios'};
        modalRef.componentInstance.columns = {comentarios: false, fecha: false};
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
