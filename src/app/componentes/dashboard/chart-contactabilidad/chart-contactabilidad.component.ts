import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-chart-contactabilidad',
  templateUrl: './chart-contactabilidad.component.html',
  styleUrls: ['./chart-contactabilidad.component.css']
})
export class ChartContactabilidadComponent implements OnInit {

  public barChartOptions: any = {
    responsive: true,
    legend: { position: 'right' },
    title: {
      display: true,
      text: 'Soles (Miles)'
    },
    plugins: {
      datalabels: {
        color: 'white',
      }
    }
  };

  // Pie
  public pieChartLabels: string[] = ['Contados', 'No contactados', 'No respondieron'];
  public pieChartData: number[] = [500, 150, 50];
  public pieChartType = 'pie';
  lineChartColours: Array<any> = [{
    backgroundColor: ["#4dbd74","#20a8d8", "#dc3545"]
  }];


  constructor() { }

  ngOnInit() {
  }
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }


}
