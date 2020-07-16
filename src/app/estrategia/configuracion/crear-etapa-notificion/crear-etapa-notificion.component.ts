import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NotificacionService} from '../../../servicios/estrategia/notificacion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {ReturnStatement} from '@angular/compiler';
import {Cartera} from '../../../interfaces/cartera';

declare const $: any;

@Component({
  selector: 'app-crear-etapa-notificion',
  templateUrl: './crear-etapa-notificion.component.html',
  styleUrls: ['./crear-etapa-notificion.component.css']
})
export class CrearEtapaNotificionComponent implements OnInit {
  cartera: Cartera;
  form: FormGroup;
  notificaciones: any[] = [];
  obj: any;
  create = true;
  rangos = [];
  dias: any[] = [];
  max = 0;
  horas: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notificacionService: NotificacionService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      codTipoNotificacion: ['', Validators.required],
      codEnvio: [''],
      codDia: [''],
      hora: ['', Validators.required],
      mensaje: ['', Validators.required],
      dias: [''],
      nombre: ['', Validators.required],
      titulo: [''],
    });

    if (this.cartera) {

      for (let i = this.cartera.horaInicio; i <= this.cartera.horaFin; i++) {
        this.horas.push(i);
      }

      if (!this.create) {
        this.form.controls.codTipoNotificacion.setValue(this.obj.codTipoNotificacion);
        this.form.controls.mensaje.setValue(this.obj.mensaje);
        this.form.controls.dias.setValue(this.obj.dias);
        this.form.controls.nombre.setValue(this.obj.nombre);
        this.form.controls.hora.setValue(this.obj.hora);
        const dias = this.obj.dias.split(',');
        dias.forEach(v => {
          if (!isNaN(v)) {
            this.dias.push(Number(v));
          }
        });
        const item = this.notificaciones.find(v => v.codTipoNotificacion == this.obj.codTipoNotificacion);
        if (item) {
          this.max = item.limiteCaracteres;
        } else {
          this.max = 0;
        }
        this.form.get('mensaje').setValidators([Validators.required, Validators.maxLength(this.max)]);
        this.form.get('mensaje').updateValueAndValidity();
      }
    }
  }

  guardar() {
    if (this.dias.length == 0) {
      this.toastr.error('Debe seleccionar los dias para enviar la notifiación.');
      return;
    }
    this.obj.codTipoNotificacion = this.form.controls.codTipoNotificacion.value;
    this.obj.mensaje = this.form.controls.mensaje.value;
    this.obj.nombre = this.form.controls.nombre.value;
    this.obj.hora = this.form.controls.hora.value;
    this.obj.dias = this.dias.toString();
    if (this.create) {
      this.spinner.show();
      this.notificacionService.guardarNotificacionEtapa(this.obj).subscribe(
        response => {
          if (response.exito) {
            this.activeModal.dismiss({flag: true});
            return;
          }
        }
      );
    } else {
      this.spinner.show();
      this.notificacionService.actualizarNotificacionEtapa(this.obj).subscribe(
        response => {
          if (response.exito) {
            this.activeModal.dismiss({flag: true});
            return;
          }
        }
      );
    }
  }

  validarDias() {
    const dias = this.form.controls.dias.value;
    const $dias = dias.split(',');
    const days: any[] = [];

    $dias.forEach(v => {
      if (isNaN(Number(v))) {
        this.toastr.error('El valor ingresado no es valido.');
        return;
      }

      const existe = this.rangos.includes(Number(v));
      if (existe) {
        days.push(Number(v));
      } else {
        this.toastr.error('El día ingresado no se encuantra en los rangos de dias disponible.');
        return;
      }
    });
  }

  seleccionarDia(item) {
    const input = $('#rango-' + item);

    if (input.hasClass('hidden')) {
      input.removeClass('hidden');
      this.dias.push(item);
    } else {
      input.addClass('hidden');
      const index = this.dias.findIndex(v => v == item);
      this.dias.splice(index, 1);
    }
  }

  estaIncluido(item) {
    return this.dias.includes(item);
  }

  cambiar() {
    const not = this.form.controls.codTipoNotificacion.value;
    const item = this.notificaciones.find(v => v.codTipoNotificacion == not);
    if (item) {
      this.max = item.limiteCaracteres;
    } else {
      this.max = 0;
    }
    this.form.get('mensaje').setValidators([Validators.required, Validators.maxLength(this.max)]);
    this.form.get('mensaje').updateValueAndValidity();
  }
}
