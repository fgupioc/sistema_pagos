import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TipoNotificacionService} from '../../../servicios/tipo-notificacion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthorityService} from '../../../servicios/authority.service';
import {Autorizacion} from '../../../comun/autorzacion';
import {TipoNotificacion} from '../../../models/tipo-notificacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenedor-tipo-notificacion',
  templateUrl: './mantenedor-tipo-notificacion.component.html',
  styleUrls: ['./mantenedor-tipo-notificacion.component.css']
})
export class MantenedorTipoNotificacionComponent implements OnInit {
  public A = Autorizacion;
  // notificaciones: TipoNotificacion[] = [];
  form: FormGroup;
  create = true;
  notificacion: TipoNotificacion;

  constructor(
    public activeModal: NgbActiveModal,
    private tipoNotificacionService: TipoNotificacionService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public AS: AuthorityService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      limiteCaracteres: ['', [Validators.required]]
    });

    if (!this.create) {
      this.form.controls.nombre.setValue(this.notificacion.nombre);
      this.form.controls.limiteCaracteres.setValue(this.notificacion.limiteCaracteres);
    }
  }

  created() {
    if (this.form.invalid) {
      Swal.fire('Nueva Notificación', 'Debe ingresar los datos obligatorios', 'error');
      return;
    }
    const {nombre, limiteCaracteres} = this.form.getRawValue();
    const datos: TipoNotificacion = new TipoNotificacion(nombre, limiteCaracteres);
    this.spinner.show();
    this.tipoNotificacionService.created(datos).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Notificación', res.mensaje, 'success');
          this.activeModal.dismiss({flag: true});
        } else {
          Swal.fire('Notificación', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  updated() {
    const {nombre, limiteCaracteres} = this.form.getRawValue();
    this.notificacion.nombre = nombre;
    this.notificacion.limiteCaracteres = limiteCaracteres;
    this.spinner.show();
    this.tipoNotificacionService.updated(this.notificacion).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Notificación', res.mensaje, 'success');
          this.activeModal.dismiss({flag: true});
        } else {
          Swal.fire('Notificación', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }
}
