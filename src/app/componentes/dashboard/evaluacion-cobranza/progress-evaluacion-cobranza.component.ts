import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-progress-evaluacion-cobranza',
  templateUrl: './progress-evaluacion-cobranza.component.html',
  styleUrls: ['./progress-evaluacion-cobranza.component.css']
})
export class ProgressEvaluacionCobranzaComponent implements OnInit {

  @Input() stacked: any[] = [];
  clases: any[] = [
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
  ];

  constructor() {
  }

  ngOnInit(): void {

  }

  getClass(code: string) {

  }



}
