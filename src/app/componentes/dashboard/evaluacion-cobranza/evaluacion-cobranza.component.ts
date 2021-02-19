import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluacion-cobranza',
  templateUrl: './evaluacion-cobranza.component.html',
  styleUrls: ['./evaluacion-cobranza.component.css']
})
export class EvaluacionCobranzaComponent implements OnInit {

  stacked: any[] = [];

  constructor() {
    this.randomStacked();
  }

  ngOnInit(): void {

  }

  randomStacked(): void {

    this.stacked.push(
      {
        value: 20,
        class: 'bg-danger-dark',
        label: 'Perdida'
      },
      {
        value: 20,
        class: 'bg-danger',
        label: 'Dudoso'
      },
      {
        value: 20,
        class: 'bg-orange',
        label: 'Deficiente'
      },
      {
        value: 20,
        class: 'bg-yellow',
        label: 'Con problema potencial'
      },
      {
        value: 20,
        class: 'bg-success',
        label: 'Normal'
      },
    );

  }


}
