import {Component, Input, OnInit} from '@angular/core';
import {Color} from 'ng2-charts';

@Component({
  selector: 'app-chart-contactabilidad',
  templateUrl: './chart-contactabilidad.component.html',
  styleUrls: ['./chart-contactabilidad.component.css']
})
export class ChartContactabilidadComponent implements OnInit {
  @Input() pieChartData: any[] = [];
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
  public pieChartLabels: string[] = ['Contados', 'No contactados', 'No respondieron'];
  public pieChartType = 'pie';
  lineChartColours: Array<any> = [{
    backgroundColor: ['#4dbd74', '#20a8d8', '#dc3545']
  }];


  constructor() {
  }

  ngOnInit() {
    this.barChartOptions.title.text = this.title + ' (Miles)';
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }


}
