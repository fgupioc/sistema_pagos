import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {FUNC} from '../../../comun/FUNC';

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
  personaCreate: any;
  personaUpdate: any;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formEtapa = this.formBuilder.group({
      codEtapa: [''],
      codGestion: [''],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      codigo: [{ value: '', disabled: true }, [
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
      color: [''],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [1],
      notificacionEtapas: []
    });

    if (!this.create) {
      this.formEtapa.setValue(this.etapas[this.index]);
      this.formEtapa.controls.userCreate.setValue(this.personaCreate);
      this.formEtapa.controls.userUpdate.setValue(this.personaUpdate);
      this.formEtapa.controls.fechaCreacion.setValue(FUNC.formatDate(this.etapas[this.index].fechaCreacion, 'd MMMM yy h:mm a'));
      this.formEtapa.controls.fechaActualizacion.setValue(FUNC.formatDate(this.etapas[this.index].fechaActualizacion, 'd MMMM yy h:mm a'));
    }
  }

  guardar() {
    if (this.formEtapa.invalid) {
      Swal.fire('Registrar Etapa', 'Debe ingresar los datos necesarios.', 'error');
      return;
    }
    const data: any = this.formEtapa.getRawValue();
    console.log(data);
    this.etapas.push(data);
    this.activeModal.dismiss(this.etapas);
  }

  actualzar() {
    if (this.formEtapa.invalid) {
      Swal.fire('Actualizar Etapa', 'Debe ingresar los datos necesarios.', 'error');
      return;
    }
    this.etapas[this.index] = this.formEtapa.getRawValue();
    this.etapas[this.index].fechaCreacion = null;
    this.etapas[this.index].fechaActualizacion = null;
    this.etapas[this.index].userCreate = null;
    this.etapas[this.index].userUpdate = null;
    console.log(this.etapas[this.index]);
    this.activeModal.dismiss(this.etapas);
  }

  validarDesde() {
    this.formEtapa.controls.hasta.setValue(0);
    const desde = Number(this.formEtapa.controls.desde.value);

    if (desde < this.gestion.desde || desde > this.gestion.hasta) {
      Swal.fire('Actualizar Etapa', 'El valor del  campo desde no es valido.', 'error');
      this.formEtapa.controls.desde.setValue(0);
      return;
    }

    if (this.create) {
      if (this.etapas.length > 0) {
        let flag = true;
        this.etapas.forEach(v => {
          if (desde <= v.hasta) {
            flag = false;
          }
        });
        if (!flag) {
          Swal.fire('Actualizar Etapa', 'La cantidad del campo desde no es valido.', 'error');
          this.formEtapa.controls.desde.setValue(0);
          return;
        }
      }
    } else {
      const etapas = this.etapas.filter((v, i) => i < this.index);
      if (etapas.length > 0) {
        let flag = true;
        etapas.forEach(v => {
          if (desde <= v.hasta) {
            flag = false;
          }
        });
        if (!flag) {
          Swal.fire('Actualizar Etapa', 'La cantidad del campo desde no es valido.', 'error');
          this.formEtapa.controls.desde.setValue(this.gestion.desde);
          return;
        }
      }
    }
  }

  validarHasta() {
    const desde = Number(this.formEtapa.controls.desde.value);
    const hasta = Number(this.formEtapa.controls.hasta.value);

    if (hasta < this.gestion.desde || hasta > this.gestion.hasta) {
      Swal.fire('Actualizar Etapa', 'El valor del  campo hasta no es valido.', 'error');
      this.formEtapa.controls.hasta.setValue(0);
      return;
    }

    if (this.create) {
      if (hasta <= desde) {
        Swal.fire('Actualizar Etapa', 'La cantidad del campo hasta no es valido.', 'error');
        this.formEtapa.controls.hasta.setValue(0);
        return;
      }
    } else {
      if (hasta <= desde) {
        Swal.fire('Actualizar Etapa', 'La cantidad del campo hasta no es valido.', 'error');
        this.formEtapa.controls.hasta.setValue(this.etapas[this.index].hasta);
        return;
      }
    }
  }

  generateCode(event: any) {
    const value = event.target.value;
    this.formEtapa.controls.codigo.setValue(FUNC.generateSlug(value));
  }
}
