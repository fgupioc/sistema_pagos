import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EmailService} from '../../../servicios/email.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificacionService} from '../../../servicios/estrategia/notificacion.service';
import {ToastrService} from 'ngx-toastr';
import {Email} from '../../../interfaces/email';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-socio-list-emails',
  templateUrl: './list-emails.component.html',
  styleUrls: ['./list-emails.component.css']
})
export class SocioListEmailsComponent implements OnInit {
  notificaciones: any[] = [];
  emails = [];
  socioId: number;
  formulario: FormGroup;
  create = true;

  constructor(
    public activeModal: NgbActiveModal,
    private emailService: EmailService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private notificacionService: NotificacionService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.listarNotificaciones();
    this.listar();
    this.formulario = this.formBuilder.group({
      codTipoNotificacion: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      emailId: []
    });

  }

  listarNotificaciones() {
    this.notificacionService.listar().subscribe(
      response => {
        this.notificaciones = response.filter(v => v.codTipoNotificacion == 1 || v.codTipoNotificacion == 5 || v.codTipoNotificacion == 6);
      }
    );
  }

  listar() {
    this.emailService.porSocioId(this.socioId).subscribe(
      res => {
        this.spinner.hide();
        this.emails = res;
      },
      () => this.spinner.hide()
    );
  }

  guardar() {
    if (this.formulario.invalid) {
      this.toastr.error('Debe ingresar los datos obligatorios');
      return;
    }
    const {codTipoNotificacion, email} = this.formulario.getRawValue();
    const notity = this.notificaciones.find(v => v.codTipoNotificacion == codTipoNotificacion);
    const correo = this.emails.find(i => i.email == email && i.codTipoNotificacion == codTipoNotificacion);
    if (correo) {
      this.toastr.error('El correo ya se encuentra registrado para el tipo de notificación seleccionada.');
      return;
    }
    const emailDto: Email = {
      personaId: this.socioId,
      codTipoNotificacion,
      email,
      tipoNotificacion: notity.nombre
    };
    this.spinner.show();
    this.emailService.crear(emailDto).subscribe(
      res => {
        console.log(res);
        if (res) {
          this.emails.push(res);
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  update(o: Email) {
    this.formulario.controls.codTipoNotificacion.setValue(o.codTipoNotificacion);
    this.formulario.controls.email.setValue(o.email);
    this.formulario.controls.emailId.setValue(o.emailId);
    this.create = false;
  }

  editar() {
    if (this.formulario.invalid) {
      this.toastr.error('Debe ingresar los datos obligatorios');
      return;
    }
    const {codTipoNotificacion, email} = this.formulario.getRawValue();
    const notity = this.notificaciones.find(v => v.codTipoNotificacion == codTipoNotificacion);
    const correo = this.emails.find(i => i.email == email && i.codTipoNotificacion == codTipoNotificacion);
    if (correo) {
      this.toastr.error('El correo ya se encuentra registrado para el tipo de notificación seleccionada.');
      return;
    }

    const $correo = this.emails.find(v => v.emailId == this.formulario.controls.emailId.value);

    const $email: Email = Object.assign({}, $correo);
    $email.email = email;
    $email.codTipoNotificacion = codTipoNotificacion;
    $email.tipoNotificacion = notity.nombre;
    this.spinner.show();
    this.emailService.actualizar($email).subscribe(
      res => {
        if (res) {
          this.emails.map(v => {
            if (v.emailId == res.emailId) {
              v.email = res.email;
              v.codTipoNotificacion = res.codTipoNotificacion;
              v.tipoNotificacion = res.tipoNotificacion;
            }
          });
          this.formulario.reset();
          this.create = true;
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  cambioSelect() {
    const select = this.formulario.controls.codTipoNotificacion.value;
    if (isNullOrUndefined(select) || select == '') {
      this.formulario.controls.email.setValue('');
      this.create = true;
    }
  }
}
