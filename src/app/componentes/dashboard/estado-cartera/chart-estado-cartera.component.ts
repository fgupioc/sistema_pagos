import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-chart-estado-cartera',
  templateUrl: './chart-estado-cartera.component.html',
  styleUrls: ['./chart-estado-cartera.component.css']
})
export class ChartEstadoCarteraComponent implements OnInit {
  @Input() title: string;
  @Input() dataChart: any;
  @Input() year: any[];

  public barChartOptions: any = {
    responsive: true,
    legend: { position: 'right' },
    title: {
      display: true,
      text: 'Soles (Miles)'
    },
    scales: { xAxes: [], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: 'black',

      }
    }
  };
  public barChartLabels: any[] = [];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Con atraso', stack: 'a', backgroundColor: '#ff6384', barPercentage: 0.3 },
    { data: [], label: 'Al día', stack: 'a', backgroundColor: '#36a2eb', barPercentage: 0.3 }
  ];

  constructor() { }

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
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
