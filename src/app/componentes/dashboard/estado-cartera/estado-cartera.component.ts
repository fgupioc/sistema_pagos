import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-estado-cartera',
  templateUrl: './estado-cartera.component.html',
  styleUrls: ['./estado-cartera.component.css']
})
export class EstadoCarteraComponent implements OnInit {
  @Input() title: string;
  @Input() dataChart: any;

  public barChartOptions: any = {
    responsive: true,
    legend: { position: 'right' },
    title: {
      display: true,
      text: 'Soles (Miles)'
    },
    scales: { xAxes: [{barPercentage: 0.3}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: 'black',

      }
    }
  };
  public barChartLabels: any[] = ['2021'];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

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
