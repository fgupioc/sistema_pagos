import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificacionService } from '../../../servicios/estrategia/notificacion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-etapa-notificion',
  templateUrl: './crear-etapa-notificion.component.html',
  styleUrls: ['./crear-etapa-notificion.component.css']
})
export class CrearEtapaNotificionComponent implements OnInit {
  form: FormGroup;
  notificaciones: any[] = [];
  obj: any;
  create = true;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notificacionService: NotificacionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      codTipoNotificacion: ['', Validators.required],
      mensaje: ['', Validators.required]
    });

    if (!this.create) {
      this.form.controls.codTipoNotificacion.setValue(this.obj.codTipoNotificacion);
      this.form.controls.mensaje.setValue(this.obj.mensaje);
    }
  }

  guardar() {
   if (this.create) {
    this.obj.codTipoNotificacion = this.form.controls.codTipoNotificacion.value;
    this.obj.mensaje = this.form.controls.mensaje.value;
    this.spinner.show();
    this.notificacionService.guardarNotificacionEtapa(this.obj).subscribe(
      response => {
        if (response.exito) {
          this.activeModal.close();
        }
        this.spinner.hide();
      }
    );
   } else {
    this.obj.codTipoNotificacion = this.form.controls.codTipoNotificacion.value;
    this.obj.mensaje = this.form.controls.mensaje.value;
    this.spinner.show();
    this.notificacionService.actualizarNotificacionEtapa(this.obj).subscribe(
      response => {
        if (response.exito) {
          this.activeModal.close();
        }
        this.spinner.hide();
      }
    );
   }
  }
}
