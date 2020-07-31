import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-tabla-maestro',
  templateUrl: './gestionar-tabla-maestro.component.html',
  styleUrls: ['./gestionar-tabla-maestro.component.css']
})
export class GestionarTablaMaestroComponent implements OnInit {
  codTable: number;
  title: string;
  items: TablaMaestra[] = [];
  form: FormGroup;
  create = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private maestroService: MaestroService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {
    const {codTable, title} = activatedRoute.snapshot.data;
    if (isNullOrUndefined(codTable)) {
      route.navigateByUrl('/auth/dashboard');
    } else {
      this.codTable = codTable;
      this.title = title;
      this.loadElements(codTable);
    }
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
  }

  loadElements(id: string) {
    this.spinner.show();
    this.maestroService.listarElementosPorCodTable(id).subscribe(
      res => {
        this.items = res;
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
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
          this.loadElements(String(this.codTable));
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

  actualizar() {
    if (this.form.invalid) {
      Swal.fire('Actualizar', 'Debe ingresar los datos obligatorios', 'error');
      return;
    }
    const data = this.form.getRawValue();

    this.spinner.show();
    this.maestroService.actualizar(data).subscribe(
      res => {
        console.log(res);
        if (res.exito) {
          Swal.fire('Actualizar', res.mensaje, 'success');
          this.loadElements(String(this.codTable));
          this.form.reset();
          this.create = true;
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

  edit(item: TablaMaestra) {
    this.create = false;
    this.form.setValue(item);
  }

  validateCode(input: HTMLInputElement) {
    if (!isNullOrUndefined(input.value)) {
      const item = this.items.find(v => v.codItem == input.value);
      if (item) {
        this.form.controls.codItem.setErrors({incorrect: true});
      }
    }
  }

  cambiarEstado(item: TablaMaestra, state: number) {
    const estado = state == 1 ? 'Desactivar' : 'Activar';
    Swal.fire({
      text: `${estado} el elemento seleccionado.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ' + estado,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.maestroService.cambiarEstado(item, String(state)).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('', res.mensaje, 'success');
              this.loadElements(String(this.codTable));
            } else {
              Swal.fire('', res.mensaje, 'error');
            }
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
      }
    });

  }
}
