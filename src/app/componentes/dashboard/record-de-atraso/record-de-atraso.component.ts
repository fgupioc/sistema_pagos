import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-record-de-atraso',
  templateUrl: './record-de-atraso.component.html',
  styleUrls: ['./record-de-atraso.component.css']
})
export class RecordDeAtrasoComponent implements OnInit {

  alDia: any[] = [];
  atraso: any[] = [];

  constructor() { }

  ngOnInit() {
    this.alDia = [
      { label: '0 días', sol: 1530, dolar: 3520 },
      { label: '1 a 3 días', sol: 8132, dolar: 2025 },
      { label: '4 a 5 días', sol: 3560, dolar: 1820 }

    ];

    this.atraso = [
      { label: ' 6 a 15 días', sol: 523, dolar: 351 },
      { label: '7 a 15 días', sol: 1255, dolar: 1582 },
      { label: ' 8 a 15 días', sol: 3516, dolar: 3424 },
      { label: '9 a 15 días', sol: 5648, dolar: 5645 },
      { label: '10 a 15 días', sol: 56445, dolar: 3587 },
      { label: '11 a 15 días', sol: 7898, dolar: 8855 },
      { label: '12 a 15 días', sol: 3788, dolar: 1354 },
      { label: '13 a 15 días', sol: 4854, dolar: 8954 }
    ]
  }

}
