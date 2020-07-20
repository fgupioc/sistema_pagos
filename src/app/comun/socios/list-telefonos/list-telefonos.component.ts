import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TelefonoService} from '../../../servicios/telefono.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificacionService} from '../../../servicios/estrategia/notificacion.service';
import {ToastrService} from 'ngx-toastr';
import {isNullOrUndefined} from 'util';
import {Telefono} from '../../../interfaces/telefono';

@Component({
  selector: 'app-socio-list-telefonos',
  templateUrl: './list-telefonos.component.html',
  styleUrls: ['./list-telefonos.component.css']
})
export class SocioListTelefonosComponent implements OnInit {
  $telefono: Telefono;
  telefonos: Telefono[] = [];
  socioId = 0;
  notificaciones: any[] = [];
  formulario: FormGroup;
  typePhone = '01';
  max = 9;
  $fijo = 2;
  $movil = 1;
  create = true;

  constructor(
    public activeModal: NgbActiveModal,
    private telefonoService: TelefonoService,
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
      tipo: [this.$movil, Validators.required],
      operador: ['', Validators.required],
      numero: ['', [Validators.required, Validators.minLength(this.max)]],
      codCiudad: [''],
      codTipoNotificacion: ['', [Validators.required]],
    });
  }

  listarNotificaciones() {
    this.notificacionService.listar().subscribe(
      response => {
        this.notificaciones = response.filter(v => [1, 2, 3, 4, 7].includes(v.codTipoNotificacion));
      }
    );
  }

  listar() {
    this.telefonoService.porSocioId(this.socioId).subscribe(
      res => {
        this.spinner.hide();
        this.telefonos = res;
      },
      err => this.spinner.hide()
    );
  }

  guardar() {
    const phone: Telefono = this.formulario.getRawValue();
    phone.personaId = this.socioId;
    const tel = this.telefonos.find(v => v.codTipoNotificacion == phone.codTipoNotificacion && v.numero == phone.numero);
    if (tel) {
      this.toastr.warning('EL teléfono ya esta asociada a una notificación');
      return;
    }
    this.spinner.show();
    this.telefonoService.guardar(phone).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
          this.create = true;
        } else {
          this.toastr.error('Ocurrio un error.');
        }
        this.listar();
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  changeType(event: any) {
    this.typePhone = event;
    this.formulario.controls.numero.reset();
    this.formulario.controls.codCiudad.reset();
    let flag = null;
    if (event == this.$movil) {
      this.max = 9;
    } else {
      this.max = 6;
      flag = Validators.required;
    }
    this.formulario.controls.numero.setValidators([Validators.required, Validators.minLength(this.max)]);
    this.formulario.controls.codCiudad.setValidators(flag);
    this.formulario.controls.numero.updateValueAndValidity();
    this.formulario.controls.codCiudad.updateValueAndValidity();
  }

  cambioSelect() {
    const select = this.formulario.controls.codTipoNotificacion.value;
    if (isNullOrUndefined(select) || select == '') {
      this.formulario.controls.numero.reset();
      this.formulario.controls.codCiudad.reset();
    }
  }

  update(item: Telefono) {
    this.typePhone = item.tipo;
    this.formulario.controls.tipo.setValue(item.tipo);
    this.formulario.controls.operador.setValue(item.operador);
    this.formulario.controls.numero.setValue(item.numero);
    this.formulario.controls.codCiudad.setValue(item.codCiudad);
    this.formulario.controls.codTipoNotificacion.setValue(item.codTipoNotificacion);
    this.$telefono = item;
    this.create = false;
  }

  actualizar() {
    const phone: Telefono = this.formulario.getRawValue();
    const tel = this.telefonos.find(v => v.codTipoNotificacion == phone.codTipoNotificacion && v.numero == phone.numero && v.operador == phone.operador);

    if (tel) {
      this.toastr.warning('EL teléfono ya esta asociada a una notificación');
      return;
    }
    this.spinner.show();
    phone.telefonoId = this.$telefono.telefonoId;
    phone.personaId = this.socioId;
    const codOld = this.$telefono.codTipoNotificacion;
    this.telefonoService.actualizar(phone, codOld).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
          this.formulario.reset();
          this.formulario.controls.tipo.setValue(this.$movil);
          this.create = true;
        } else {
          this.toastr.error('Ocurrio un error.');
        }
        this.listar();
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }
}
