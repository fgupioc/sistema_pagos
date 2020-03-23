import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-actualizar-etapa',
  templateUrl: './actualizar-etapa.component.html',
  styleUrls: ['./actualizar-etapa.component.css']
})
export class ActualizarEtapaComponent implements OnInit {
  etapas: any[] = [];
  formEtapa: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formEtapa = this.formBuilder.group({
      codEtapa: [''],
      codGestion: [''],
      nombre: [''],
      codigo: [''],
      desde: [''],
      hasta: [''],
      color: [''],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [1],
    });
  }

  guardar() {
    const data: any = this.formEtapa.getRawValue();
    this.etapas.push(data);
    this.activeModal.dismiss(this.etapas);
  }
}
