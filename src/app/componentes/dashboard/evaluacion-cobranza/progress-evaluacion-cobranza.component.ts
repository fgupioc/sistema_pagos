import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-progress-evaluacion-cobranza',
  templateUrl: './progress-evaluacion-cobranza.component.html',
  styleUrls: ['./progress-evaluacion-cobranza.component.css']
})
export class ProgressEvaluacionCobranzaComponent implements OnInit {

  @Input() stacked: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }
}
