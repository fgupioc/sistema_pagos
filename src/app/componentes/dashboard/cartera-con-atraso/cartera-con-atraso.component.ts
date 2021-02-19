import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cartera-con-atraso',
  templateUrl: './cartera-con-atraso.component.html',
  styleUrls: ['./cartera-con-atraso.component.css']
})
export class CarteraConAtrasoComponent implements OnInit {

  saldosCapital: any[] = [];

  constructor() { }

  ngOnInit() {
    this.saldosCapital.push(
      { desde: 1, hasta: 1000 },
      { desde: 1001, hasta: 5000 },
      { desde: 5001, hasta: 10000 },
      { desde: 10001, hasta: 25000 },
      { desde: 25001, hasta: 50000 },
      { desde: 50001, hasta: 75000 },
      { desde: 75001, hasta: 100000 },
      { desde: 1000001, hasta: 0 }
    );
  }


}
