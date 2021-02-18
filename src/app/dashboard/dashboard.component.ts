import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public barChartOptions: any = {
    responsive: true,
    legend: { position: 'right' },
    title: {
      display: true,
      text: 'Soles (Miles)'
    }
  };
  public barChartLabels: any[] = ['2021'];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: any[] = [
    { data: [28], label: 'Con atraso', stack: 'a',  backgroundColor: '#ff6384'  },
    { data: [65], label: 'Al día', stack: 'a', backgroundColor: '#36a2eb' }
  ];


  constructor() { }

  ngOnInit() {
  }


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
