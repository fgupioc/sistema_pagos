import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chart-cartera-con-atraso',
  templateUrl: './chart-cartera-con-atraso.component.html',
  styleUrls: ['./chart-cartera-con-atraso.component.css']
})
export class ChartCarteraConAtrasoComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() divisiones: any[] = [];
  @Input() title = '';

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
    }
  };


  // Pie
  public pieChartLabels: string[] = ['0 - 15 días', '16 - 30 días', '31 a más días'];
  public pieChartData: any[] = [];
  public pieChartType = 'pie';
  lineChartColours: Array<any> = [{
    backgroundColor: ['#ffea00', '#ff9600', '#dc3545']
  }];


  constructor() {
  }

  ngOnInit() {
    this.barChartOptions.title.text = this.title + ' (Miles)';
    if (this.data.length > 0) {
      this.pieChartData = this.data;
    }
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

}
