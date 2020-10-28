import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-compromiso-pago',
  templateUrl: './compromiso-pago.component.html',
  styleUrls: ['./compromiso-pago.component.css']
})
export class CompromisoPagoComponent implements OnInit {
  formPlanPago: FormGroup;
  formRegistrarAcuerdo: FormGroup;
  info: any;
  comment: string;
  typeAcuerdo = 0;
  errors: string[] = [];
  dateDefault = moment(new Date()).format('YYYY-MM-DD');

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.formRegistrarAcuerdo = this.formBuilder.group({
      asignacionId: [],
      ejecutivoId: [],
      socioId: [],
      creditoId: [],
      montoAcordado: ['', [Validators.required]],
      posibilidadPago: ['', [Validators.required]],
      fechaInicio: [this.dateDefault, [Validators.required]],
      horaIncio: ['', [Validators.required]],
    });

    this.formPlanPago = this.formBuilder.group({
      asignacionId: [],
      ejecutivoId: [],
      socioId: [],
      creditoId: [],
      descripcion: ['', [Validators.required]],
      plazo: [null, [Validators.required]],
      montoAcordado: [null, [Validators.required]],
      intervalo: [null, [Validators.required]],
      fechaInicio: [this.dateDefault, [Validators.required]],
      posibilidadPago: ['', [Validators.required]],
    });
  }

  enviar() {
    console.log(this.comment);
  }


}
