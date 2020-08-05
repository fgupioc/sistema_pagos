import {Component, OnInit} from '@angular/core';
import {TipoNotificacion} from '../../../models/tipo-notificacion';
import {TipoNotificacionService} from '../../../servicios/tipo-notificacion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {Autorizacion} from '../../../comun/autorzacion';
import {AuthorityService} from '../../../servicios/authority.service';

@Component({
  selector: 'app-tipo-notificacion',
  templateUrl: './tipo-notificacion.component.html',
  styleUrls: ['./tipo-notificacion.component.css']
})
export class TipoNotificacionComponent implements OnInit {
  public A = Autorizacion;
  notificaciones: TipoNotificacion[] = [];
  form: FormGroup;
  create = true;
  notificacion: TipoNotificacion;

  constructor(
    private tipoNotificacionService: TipoNotificacionService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public AS: AuthorityService
  ) {
  }

  ngOnInit() {
    if(this.AS.has(this.A.TIPO_NOTIFICACION_LISTAR)) {
      this.loadNotifications();
    }

    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      limiteCaracteres: ['', [Validators.required]]
    });
  }

  loadNotifications() {
    this.spinner.show();
    this.tipoNotificacionService.getAll().subscribe(
      res => {
        this.notificaciones = res;
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
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
          this.create = true;
          this.form.reset();
          this.loadNotifications();
        } else {
          Swal.fire('Notificación', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  actualizarEstado(item: TipoNotificacion, state: number) {
    const estado = state ? 'Activar' : 'Desactivar';
    Swal.fire({
      title: estado + ' Notificación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ' + estado,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.tipoNotificacionService.cambiarEstado(String(item.codTipoNotificacion), String(state)).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Notificación', res.mensaje, 'success');
              this.create = true;
              this.form.reset();
              this.loadNotifications();
            } else {
              Swal.fire('Notificación', res.mensaje, 'error');
            }
            this.spinner.hide();
          },
          () => this.spinner.hide()
        );
      }
    });
  }

  edit(item: TipoNotificacion) {
    this.notificacion = item;
    this.create = false;
    this.form.controls.nombre.setValue(item.nombre);
    this.form.controls.limiteCaracteres.setValue(item.limiteCaracteres);
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
          this.create = true;
          this.form.reset();
          this.loadNotifications();
        } else {
          Swal.fire('Notificación', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }
}
