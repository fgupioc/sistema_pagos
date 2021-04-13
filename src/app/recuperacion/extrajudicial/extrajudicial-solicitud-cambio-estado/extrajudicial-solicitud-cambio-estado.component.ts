import { Component, OnInit } from '@angular/core';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONST } from 'src/app/comun/CONST';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';
import { MaestroService } from '../../../servicios/sistema/maestro.service';
import { TablaMaestra } from '../../../interfaces/tabla-maestra';
import { AsignacionCarteraService } from '../../../servicios/asignacion-cartera.service';

@Component({
  selector: 'app-extrajudicial-solicitud-cambio-estado',
  templateUrl: './extrajudicial-solicitud-cambio-estado.component.html',
  styleUrls: ['./extrajudicial-solicitud-cambio-estado.component.css']
})
export class ExtrajudicialSolicitudCambioEstadoComponent implements OnInit {
  solicitudes: any[] = [];
  formGroup: FormGroup;
  formGroupInvalid = false;
  formGroupMsj = '';
  formGroupMsj2 = '';
  dateDefault = moment(new Date()).format('YYYY-MM-DD');
  condiciones: TablaMaestra[] = [];
  ejecutivos: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private extrajudicialService: ExtrajudicialService,
    private formBuilder: FormBuilder,
    private maestroService: MaestroService,
    private asignacionService: AsignacionCarteraService,
  ) { }

  ngOnInit() {
    this.loadCondicion();
    this.listarEjecutivos();
    this.loadSolicitudes('', '', '', '', '', '');
    this.formGroup = this.formBuilder.group({
      tipoBusqueda: ['1', Validators.required],
      numeroSolicitud: [''],
      gestor: [''],
      condicion: [''],
      inicio: [this.dateDefault],
      fin: [''],
    });
  }
  loadCondicion() {
    this.maestroService.listarElementosPorCodTable(CONST.TABLE_STR_LISTA_TIPO_CONDICIONES_SOLICITUD).subscribe(
      res => {
        this.condiciones = res;
      }
    );
  }

  get numeroSolicitud() {
    return this.formGroup.get('numeroSolicitud');
  }

  loadSolicitudes(tipoBusqueda: any, numeroSolicitud: any, gestor: any, condicion: any, inicio: any, fin: any) {
    this.spinner.show();
    this.extrajudicialService.listarsolicitudes(CONST.C_SOLICITUD_EXTRAJUDICIAL, tipoBusqueda, numeroSolicitud, gestor, condicion, inicio, fin).subscribe(
      res => {
        if (res.exito) {
          this.solicitudes = res.solicitudes;
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  changeType(event) {
    this.formGroupInvalid = false;
    this.formGroupMsj = '';
    this.formGroupMsj2 = '';

    this.formGroup.controls.numeroSolicitud.setValue('');
    this.formGroup.controls.gestor.setValue('');
    this.formGroup.controls.condicion.setValue('');
    this.formGroup.controls.inicio.setValue(this.dateDefault);
    this.formGroup.controls.fin.setValue('');

  }

  buscar() {
    this.formGroupInvalid = false;
    this.formGroupMsj = '';
    const { tipoBusqueda, numeroSolicitud, gestor, condicion, inicio, fin } = this.formGroup.getRawValue();
    const init = moment(inicio);

    if (tipoBusqueda == '1' && (isNullOrUndefined(numeroSolicitud) || numeroSolicitud.trim().length == 0)) {
      this.formGroupMsj = 'El campo número de solicitud es obligatorio.';
      this.formGroupInvalid = true;
      return;
    }

    if (tipoBusqueda == '1' && numeroSolicitud.trim().length != 9) {
      this.formGroupMsj = 'El campo número de solicitud acepta 9 caracteres.';
      this.formGroupInvalid = true;
      return;
    }

    if (tipoBusqueda == '2' && (isNullOrUndefined(gestor) || gestor.trim().length == 0)) {
      this.formGroupMsj = 'El campo gestor es obligatorio.';
      this.formGroupInvalid = true;
      return;
    }

    if (tipoBusqueda == '3' && isNullOrUndefined(inicio) || inicio.trim().length == 0) {
      this.formGroupMsj = 'El campo fecha de inico es obligatorio.';
      this.formGroupInvalid = true;
      return;
    }

    if (tipoBusqueda == '3' && !init.isValid() || tipoBusqueda == '3' && inicio.trim().length > 10) {
      this.formGroupMsj = 'El campo fecha de inico no es valido.';
      this.formGroupInvalid = true;
      return;
    }

    if (tipoBusqueda == '4' && (isNullOrUndefined(condicion) || condicion.trim().length == 0)) {
      this.formGroupMsj = 'El campo estado es obligatorio.';
      this.formGroupInvalid = true;
      return;
    }

    this.loadSolicitudes(tipoBusqueda, numeroSolicitud, gestor, condicion, inicio, fin);

  }

  listarEjecutivos() {
    this.asignacionService.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
