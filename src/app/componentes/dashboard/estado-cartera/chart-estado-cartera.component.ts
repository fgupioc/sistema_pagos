import {Component, Input, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {FUNC} from '../../../comun/FUNC';

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
          return label + ' ' +  FUNC.formatCurrency(Number(value), 2) ;
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
              return FUNC.formatCurrency(value, 2);
            }
          }
        }
      ]
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return FUNC.formatCurrency(value, 2);
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
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    {data: [], label: 'Con atraso', stack: 'a', backgroundColor: '#ff6384', barPercentage: 0.3},
    {data: [], label: 'Al día', stack: 'a', backgroundColor: '#36a2eb', barPercentage: 0.3}
  ];

  constructor() {
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
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
