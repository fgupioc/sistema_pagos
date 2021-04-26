import {Component, OnInit, ViewChild} from '@angular/core';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONST } from 'src/app/comun/CONST';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';
import { MaestroService } from '../../../servicios/sistema/maestro.service';
import { TablaMaestra } from '../../../interfaces/tabla-maestra';
import { AsignacionCarteraService } from '../../../servicios/asignacion-cartera.service';
import {DataTableDirective} from "angular-datatables";
import {ToastrService} from "ngx-toastr";

1

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
  gestores: any[] = [];
  gestorSeleccionado = '';
  expediendesSeleccionados: any = [];

  dtOptions: DataTables.Settings = CONST.DATATABLE_ES();
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  search = false;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private extrajudicialService: ExtrajudicialService,
    private formBuilder: FormBuilder,
    private maestroService: MaestroService,
    private asignacionService: AsignacionCarteraService,
  ) { }

  ngOnInit() {
    this.listarGestoresRecuperacion();
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
    this.search = true;
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


  seleccionarExpediente(event: any, item: any, checkInput: HTMLInputElement) {
    if (item.condicion != 'A') {
      checkInput.checked = false;
      return;
    }
    const index = this.expediendesSeleccionados.findIndex(i => i.codSolicitud == item.codSolicitud);

    if(event.target.checked) {
      if (index == -1) {
        this.expediendesSeleccionados.push(item);
      }
    } else {
      if (index >= 0){
        this.expediendesSeleccionados = this.expediendesSeleccionados.filter(i => i.codSolicitud != item.codSolicitud);
      }
    }

    if(this.expediendesSeleccionados.length == 0)
      this.gestorSeleccionado = '';
  }

  asignarEjecutivo() {
    if(this.expediendesSeleccionados.length == 0) {
      this.toastr.warning("Debe de seleccionar almenos un expediente.");
      return;
    }
    if(this.gestorSeleccionado.trim().length == 0) {
      this.toastr.warning("Debe de seleccionar un gestor.");
      return;
    }
    this.spinner.show();
    this.extrajudicialService.asignarGestorExpedientes(this.gestorSeleccionado, this.expediendesSeleccionados).subscribe(
      res => {
        if(res.exito){
          this.toastr.success(res.mensaje);
          if(this.search){
            this.buscar();
          } else {
            this.loadSolicitudes('', '', '', '', '', '');
          }
          this.gestorSeleccionado = '';
          this.expediendesSeleccionados = [];
        } else {
          this.toastr.warning(res.mensaje);
          this.spinner.hide();
        }
      },
      err => {
        console.error(err);
        this.spinner.hide();
      }
    );
  }

  private listarGestoresRecuperacion() {
    this.extrajudicialService.getEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.gestores = res.objeto as any[];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
