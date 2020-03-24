import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-etapa',
  templateUrl: './actualizar-etapa.component.html',
  styleUrls: ['./actualizar-etapa.component.css']
})
export class ActualizarEtapaComponent implements OnInit {
  etapas: any[] = [];
  formEtapa: FormGroup;
  index: any;
  create = true;
  gestion: any;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formEtapa = this.formBuilder.group({
      codEtapa: [''],
      codGestion: [''],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      codigo: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      desde: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      hasta: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      color: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [1],
    });

    if (!this.create) {
        this.formEtapa.setValue(this.etapas[this.index]);
    }

    console.log(this.gestion);
  }

  guardar() {
    if (this.formEtapa.invalid) {
      Swal.fire('Registrar Etapa', 'Debe ingresar los datos necesarios.', 'error');
      return;
    }
    const data: any = this.formEtapa.getRawValue();
    this.etapas.push(data);
    this.activeModal.dismiss(this.etapas);
  }

  actualzar() {
    if (this.formEtapa.invalid) {
      Swal.fire('Actualizar Etapa', 'Debe ingresar los datos necesarios.', 'error');
      return;
    }
    const data: any = this.formEtapa.getRawValue();
    this.etapas[this.index] = data;
    this.activeModal.dismiss(this.etapas);
  }
}
