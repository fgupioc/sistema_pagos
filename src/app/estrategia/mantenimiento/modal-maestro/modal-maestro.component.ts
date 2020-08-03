import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {isNullOrUndefined} from 'util';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-modal-maestro',
  templateUrl: './modal-maestro.component.html',
  styles: []
})
export class ModalMaestroComponent implements OnInit {
  form: FormGroup;
  create = true;
  codTable: number;
  items: TablaMaestra[] = [];
  item: TablaMaestra;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private maestroService: MaestroService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      codItem: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      intValor: [''],
      strValor: [''],
      codTabla: [this.codTable],
      codEstado: [''],
    });

    if (!this.create) {
      this.form.controls.codItem.disable();
      this.form.setValue(this.item);
    }
  }

  guardar() {
    if (this.form.invalid) {
      Swal.fire('Registrar', 'Debe ingresar los datos obligatorios', 'error');
      return;
    }
    const data = this.form.getRawValue();
    data.codTabla = this.codTable;
    this.spinner.show();
    this.maestroService.crear(data).subscribe(
      res => {
        console.log(res);
        if (res.exito) {
          Swal.fire('Registrar', res.mensaje, 'success');
          this.form.reset();
          this.activeModal.dismiss({flag: true});
        } else {
          Swal.fire('Registrar', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  actualizar() {
    if (this.form.invalid) {
      Swal.fire('Actualizar', 'Debe ingresar los datos obligatorios', 'error');
      return;
    }
    const {codItem, codTabla, ...data} = this.form.getRawValue();
    data.codItem = this.item.codItem;
    data.codTabla = this.codTable;

    this.spinner.show();
    this.maestroService.actualizar(data).subscribe(
      res => {
        console.log(res);
        if (res.exito) {
          Swal.fire('Actualizar', res.mensaje, 'success');
          this.activeModal.dismiss({flag: true});
          this.form.reset();
        } else {
          Swal.fire('Registrar', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  validateCode(input: HTMLInputElement) {
    if (!isNullOrUndefined(input.value)) {
      const item = this.items.find(v => v.codItem == input.value);
      if (item) {
        this.form.controls.codItem.setErrors({incorrect: true});
      }
    }
  }

}
