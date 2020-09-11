import {Component, OnInit} from '@angular/core';
import {Cartera} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {Credito} from '../../../interfaces/credito';
import {Persona} from '../../../interfaces/Persona';
import * as moment from 'moment';
import {Telefono} from '../../../interfaces/telefono';
import {Email} from '../../../interfaces/email';
import {Direccion} from '../../../interfaces/direccion';
import {CONST} from '../../../comun/CONST';
import {TipoNotificacionService} from '../../../servicios/tipo-notificacion.service';
import {TipoNotificacion} from '../../../models/tipo-notificacion';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Recordatorio} from '../../../interfaces/recordatorio';
import Swal from 'sweetalert2';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {ModalAsignarEstadoRecordatorioComponent} from '../modal-asignar-estado-recordatorio/modal-asignar-estado-recordatorio.component';

@Component({
  selector: 'app-credito-socio',
  templateUrl: './credito-socio.component.html',
  styles: []
})
export class CreditoSocioComponent implements OnInit {
  credito: Credito;
  ejecutivoId: any;
  asignacionId: any;
  socio: Persona;
  title = 'Gestionar Eventos Socio';
  typeEvent = 1;
  showItem: string;
  tipoNotificaciones: TipoNotificacion[] = [];
  $telefonos: Telefono[] = [];
  formRecordatorio: FormGroup;
  dateDefault = moment(new Date()).format('YYYY-MM-DD');
  recordatorios: Recordatorio[] = [];
  tipoActividades: TablaMaestra[] = [];
  estadosRecordatorio: TablaMaestra[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private tipoNotificacionService: TipoNotificacionService,
    private formBuilder: FormBuilder,
    private tablaMaestraService: MaestroService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    activatedRoute.params.subscribe(({ejecutivoId, asignacionId}) => {
      if (asignacionId == undefined || ejecutivoId == undefined || asignacionId == 'undefined' || ejecutivoId == 'undefined') {
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
      }

      if (ejecutivoId && asignacionId) {
        this.ejecutivoId = ejecutivoId;
        this.asignacionId = asignacionId;
        const state = this.router.getCurrentNavigation().extras.state;
        if (state) {
          this.credito = state.credito;
        } else {
          router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${ejecutivoId}/listado/${asignacionId}/detalle`);
        }
      } else {
        router.navigateByUrl('/auth/estrategia/asignacion-cartera');
      }

    });
  }

  ngOnInit() {
    this.listarTipoActividades();
    this.loadTipoNotificaciones();
    this.loadEstadosRecordatorios();
    if (this.credito) {
      this.formRecordatorio = this.formBuilder.group({
        asignacionId: [this.asignacionId],
        ejecutivoId: [this.ejecutivoId],
        socioId: [this.credito.socioId],
        creditoId: [this.credito.id],
        fecha: [this.dateDefault, [Validators.required]],
        hora: ['', [Validators.required]],
        tipoActividad: ['', [Validators.required]],
        numeroTelefono: [''],
        correo: [''],
        tipoMetodo: [''],
        direccion: [''],
        comentario: [''],
      });
      setTimeout(() => this.spinner.show(), 200);
      this.buscarSocioById(this.credito.socioId);
      if (this.asignacionId && this.ejecutivoId) {
        this.loadRecordatorios(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
      }
    }
  }

  loadEstadosRecordatorios() {
    this.tablaMaestraService.loadEstadosRecordatorios().subscribe(
      res => this.estadosRecordatorio = res
    );
  }
  private buscarSocioById(socioId: number) {
    this.asignacionCarteraService.buscarSocioByCodUsuario(socioId).subscribe(
      res => {
        if (res.exito) {
          this.socio = res.objeto;
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  crearRecordatorio(tipo: number, title: string) {
    this.formRecordatorio.controls.fecha.setValue(this.dateDefault);
    this.formRecordatorio.controls.tipoActividad.setValue('');
    this.formRecordatorio.controls.numeroTelefono.setValue('');
    this.formRecordatorio.controls.correo.setValue('');
    this.formRecordatorio.controls.tipoMetodo.setValue('');
    this.formRecordatorio.controls.direccion.setValue('');
    this.formRecordatorio.controls.comentario.setValue('');
    this.title = title;
    this.typeEvent = tipo;
  }

  public get showPhones(): Telefono[] {
    const phones: Telefono[] = [];
    this.socio.telefonos.forEach(item => {
      if (item.codTipoNotificacion == CONST.C_INT_LLAMADAS) {
        const exit = phones.find(i => i.numero == item.numero);
        if (!exit) {
          phones.push(item);
        }
      }
    });
    return phones;
  }

  public get showCellphones(): Telefono[] {
    const index = [CONST.C_INT_SMS, CONST.C_INT_WHATSAPP, CONST.C_INT_TELEGRAM];
    const phones: Telefono[] = [];
    this.socio.telefonos.forEach(item => {
      if (index.includes(item.codTipoNotificacion)) {
        const exit = phones.find(i => i.numero == item.numero);
        if (!exit) {
          phones.push(item);
        }
      }
    });
    return phones;
  }

  public get showEmails(): Email[] {
    const index = [CONST.C_INT_MESSAGER, CONST.C_INT_EMAIL];
    const emails: Email[] = [];
    this.socio.correos.forEach(item => {
      if (index.includes(item.codTipoNotificacion)) {
        const exit = emails.find(i => i.email == item.email);
        if (!exit) {
          emails.push(item);
        }
      }
    });
    return emails;
  }

  public get showAddress(): Direccion[] {
    return this.socio.direcciones;
  }

  public get listadoMensaje(): TipoNotificacion[] {
    const index = [CONST.C_INT_SMS, CONST.C_INT_WHATSAPP, CONST.C_INT_TELEGRAM];
    return this.tipoNotificaciones.filter(item => index.includes(item.codTipoNotificacion));
  }


  private loadTipoNotificaciones() {
    this.tipoNotificacionService.getAll().subscribe(
      res => this.tipoNotificaciones = res
    );
  }

  cambioTipoMetodo(event: any) {
    this.socio.telefonos.forEach(item => {
      if (event == item.tipoNotificacion) {
        const exit = this.$telefonos.find(i => i.numero == item.numero);
        if (!exit) {
          this.$telefonos.push(item);
        }
      }
    });
    return this.$telefonos;
  }

  guardarRecordatorio() {
    const data = this.formRecordatorio.getRawValue();
    this.formRecordatorio.reset();
    this.formRecordatorio.controls.asignacionId.setValue(this.asignacionId);
    this.formRecordatorio.controls.ejecutivoId.setValue(this.ejecutivoId);
    this.formRecordatorio.controls.socioId.setValue(this.credito.socioId);
    this.formRecordatorio.controls.creditoId.setValue(this.credito.id);
    this.formRecordatorio.controls.fecha.setValue(this.dateDefault);
    this.spinner.show();
    this.asignacionCarteraService.crearRecordatorioPorAsignacionYCredito(this.asignacionId, data).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Información de Socio', res.mensaje, 'success');
          this.loadRecordatorios(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
        } else {
          Swal.fire('Información de Socio', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  private loadRecordatorios(asignacionId: any, ejecutivoId: any, socioId: number, creditoId: number) {
    this.asignacionCarteraService.listarRecordatorioPorAsignacionYCredito(asignacionId, ejecutivoId, socioId, creditoId).subscribe(
      res => {
        if (res.exito) {
          this.recordatorios = res.objeto as Recordatorio[];
        }
      }
    );
  }

  private listarTipoActividades() {
    this.tablaMaestraService.listarTipoActividades().subscribe(
      res => {
        this.tipoActividades = res;
      }
    );
  }

  getNameActividad(tipoActividad: string) {
    const item = this.tipoActividades.find(i => i.codItem == tipoActividad);
    return item ? item.descripcion : '';
  }

  getDescripcion(item: Recordatorio) {
    let msj = '';
    if (item.numeroTelefono) {
      msj = item.numeroTelefono;
      if (item.tipoMetodo) {
        msj += ` - ${item.tipoMetodo}`;
      }
    }

    if (item.correo) {
      msj = item.correo;
      if (item.tipoMetodo) {
        msj += ` - ${item.tipoMetodo}`;
      }
    }

    if (item.direccion) {
      msj = item.direccion;
    }
    return msj;
  }

  cambiarEstado(item: Recordatorio) {
    const modal = this.modalService.open(ModalAsignarEstadoRecordatorioComponent, {size: 'sm', centered: true});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    modal.componentInstance.estados = this.estadosRecordatorio;
    modal.componentInstance.recordatorio = item;
  }

  closeModal(res: any) {
    if (res && res.exito) {
      this.loadRecordatorios(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
    }
  }

  getNameCondition(condicion: string) {
    const item = this.estadosRecordatorio.find(i => i.codItem == condicion);
    return item ? item.descripcion : '';
  }
}
