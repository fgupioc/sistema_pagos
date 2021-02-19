import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-cartera-con-atraso',
  templateUrl: './chart-cartera-con-atraso.component.html',
  styleUrls: ['./chart-cartera-con-atraso.component.css']
})
export class ChartCarteraConAtrasoComponent implements OnInit {

  public barChartOptions: any = {
    responsive: true,
    legend: { position: 'right' },
    title: {
      display: true,
      text: 'Soles (Miles)'
    },

  };

  // Pie
  public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType = 'pie';

  constructor() { }

  ngOnInit() {
  }
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

}
