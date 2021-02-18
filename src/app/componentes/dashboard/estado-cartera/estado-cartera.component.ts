import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-estado-cartera',
  templateUrl: './estado-cartera.component.html',
  styleUrls: ['./estado-cartera.component.css']
})
export class EstadoCarteraComponent implements OnInit {
  @Input() title: string;
  @Input() dataChart: any;

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'right' },
    title: {
      display: true,
      text: 'Soles (Miles)'
    },
    plugins: {
      datalabels: {
        display: true,
        align: 'center',
        anchor: 'center'
      }
    },
    animation: {
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var chart = this;
        var datasets = this.config.data.datasets;

        datasets.forEach(function (dataset: Array<any>, i: number) {
          ctx.font = "14px Arial";
          ctx.fillStyle = "Black";
          chart.getDatasetMeta(i).data.forEach(function (p: any, j: any) {
            ctx.fillText(datasets[i].data[j], p._model.x, p._model.y + 10);
          });

        });
      }
    },
  };
  public barChartLabels: any[] = ['2021'];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Con atraso', stack: 'a', backgroundColor: '#ff6384' },
    { data: [], label: 'Al día', stack: 'a', backgroundColor: '#36a2eb' }
  ];

  constructor() { }

  ngOnInit() {
    this.barChartOptions.title.text = this.title;
    if (this.dataChart && this.barChartData.length) {
      this.barChartData[0].data = this.dataChart.atraso;
      this.barChartData[1].data = this.dataChart.dia ;
    }

  }
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
