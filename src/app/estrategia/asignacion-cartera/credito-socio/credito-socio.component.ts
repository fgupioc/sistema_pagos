import {Component, OnInit} from '@angular/core';
import {Cartera} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
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
import {AcuerdoPago} from '../../../interfaces/acuerdo-pago';
import {FUNC} from '../../../comun/FUNC';
import {isNullOrUndefined} from 'util';
import {TelefonoService} from '../../../servicios/telefono.service';
import {EmailService} from '../../../servicios/email.service';

@Component({
  selector: 'app-credito-socio',
  templateUrl: './credito-socio.component.html',
  styleUrls: ['./credito-socio.component.css']
})
export class CreditoSocioComponent implements OnInit {
  formRecordatorio: FormGroup;
  formPlanPago: FormGroup;
  formRegistrarAcuerdo: FormGroup;
  formTelefono: FormGroup;
  formCorreo: FormGroup;

  credito: Credito;
  ejecutivoId: any;
  asignacionId: any;
  socio: Persona;
  title = 'Gestiónar Eventos Socio';
  typeEvent: number;
  showItem: string;
  tipoNotificaciones: TipoNotificacion[] = [];
  $telefonos: Telefono[] = [];
  dateDefault = moment(new Date()).format('YYYY-MM-DD');
  recordatorios: Recordatorio[] = [];
  tipoActividades: TablaMaestra[] = [];
  estadosRecordatorio: TablaMaestra[] = [];
  typeAcuerdo: number;
  selectedAcuerdo: number;
  errors: string[] = [];
  acuerdosPago: AcuerdoPago[] = [];
  listaAcuerdos: TablaMaestra[] = [];
  tipoMonedas: TablaMaestra[] = [];
  seccioSeleccionada = '1';
  typePhone = '01';
  max = 9;
  $fijo = 2;
  $movil = 1;
  create = true;
  tiposUsoTelefono: TablaMaestra[] = [];
  tipoUsoEmail: TablaMaestra[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private tipoNotificacionService: TipoNotificacionService,
    private formBuilder: FormBuilder,
    private tablaMaestraService: MaestroService,
    private telefonoService: TelefonoService,
    private emailService: EmailService
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
    this.loadlistaAcuerdos();
    this.loadEstadosRecordatorios();
    this.loadTipoMonedas();
    this.loadTipoUsoTelefono();
    this.loadTipoUsoEmail();

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

      this.formRegistrarAcuerdo = this.formBuilder.group({
        asignacionId: [this.asignacionId],
        ejecutivoId: [this.ejecutivoId],
        socioId: [this.credito.socioId],
        creditoId: [this.credito.id],
        montoAcordado: ['', [Validators.required]],
        posibilidadPago: ['', [Validators.required]],
        fechaInicio: [this.dateDefault, [Validators.required]],
        horaIncio: ['', [Validators.required]],
      });

      this.formPlanPago = this.formBuilder.group({
        asignacionId: [this.asignacionId],
        ejecutivoId: [this.ejecutivoId],
        socioId: [this.credito.socioId],
        creditoId: [this.credito.id],
        descripcion: ['', [Validators.required]],
        plazo: [null, [Validators.required]],
        montoAcordado: [null, [Validators.required]],
        intervalo: [null, [Validators.required]],
        fechaInicio: [this.dateDefault, [Validators.required]],
        posibilidadPago: ['', [Validators.required]],
      });

      this.formTelefono = this.formBuilder.group({
        tipo: [this.$movil, Validators.required],
        operador: ['', Validators.required],
        numero: ['', [Validators.required, Validators.minLength(this.max)]],
        codCiudad: [''],
        codTipoNotificacion: ['', [Validators.required]],
        codUso: ['', [Validators.required]],
      });

      this.formCorreo = this.formBuilder.group({
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        codTipoNotificacion: ['', [Validators.required]],
        codUso: ['', [Validators.required]],
      });

      setTimeout(() => this.spinner.show(), 200);
      this.buscarSocioById(this.credito.socioId);
      if (this.asignacionId && this.ejecutivoId) {
        this.loadRecordatorios(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
        this.loadAcuerdosPagos(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
      }
    }
  }

  loadEstadosRecordatorios() {
    this.tablaMaestraService.loadEstadosRecordatorios().subscribe(
      res => this.estadosRecordatorio = res
    );
  }

  private loadTipoUsoEmail() {
    this.tablaMaestraService.loadTipoUsoEmail().subscribe(
      res => this.tipoUsoEmail = res
    );
  }

  loadTipoMonedas() {
    this.tablaMaestraService.listarMondas().subscribe(
      res => this.tipoMonedas = res
    );
  }

  loadTipoUsoTelefono() {
    this.tablaMaestraService.listarTipoUso().subscribe(
      res => this.tiposUsoTelefono = res
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

  crearEventos(tipo: number, title: string) {
    this.formRecordatorio.controls.fecha.setValue(this.dateDefault);
    this.formRecordatorio.controls.tipoActividad.setValue('');
    this.formRecordatorio.controls.numeroTelefono.setValue('');
    this.formRecordatorio.controls.correo.setValue('');
    this.formRecordatorio.controls.tipoMetodo.setValue('');
    this.formRecordatorio.controls.direccion.setValue('');
    this.formRecordatorio.controls.comentario.setValue('');
    this.typeEvent = tipo;
    this.typeAcuerdo = null;
    this.selectedAcuerdo = null;
    this.title = title;
    this.resetFormTelefono();

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


  loadlistaAcuerdos() {
    this.tablaMaestraService.loadTipoAcuerdos().subscribe(
      res => this.listaAcuerdos = res
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

  loadRecordatorios(asignacionId: any, ejecutivoId: any, socioId: number, creditoId: number) {
    this.asignacionCarteraService.listarRecordatorioPorAsignacionYCredito(asignacionId, ejecutivoId, socioId, creditoId).subscribe(
      res => {
        if (res.exito) {
          this.recordatorios = res.objeto as Recordatorio[];
        }
      }
    );
  }

  loadAcuerdosPagos(asignacionId: any, ejecutivoId: any, socioId: number, creditoId: number) {
    this.asignacionCarteraService.listarAcuerdosPorAsignacionYCredito(asignacionId, ejecutivoId, socioId, creditoId).subscribe(
      res => {
        if (res.exito) {
          this.acuerdosPago = res.objeto as AcuerdoPago[];
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

  getNameCondition(condicion: any) {
    const item = this.estadosRecordatorio.find(i => i.codItem == condicion);
    return item ? item.descripcion : '';
  }

  getNameTipoAcuerdo(condicion: any) {
    const item = this.listaAcuerdos.find(i => i.codItem == condicion);
    return item ? item.descripcion : '';
  }

  guardarAcuerdo() {
    this.errors = [];
    if (this.formRegistrarAcuerdo.invalid) {
      this.errors.push('Debe llenar los datos obligatorios.');
      return;
    }
    const data: AcuerdoPago = this.formRegistrarAcuerdo.getRawValue();
    data.tipoAcuerdo = this.typeAcuerdo;
    data.descripcion = 'estandar';
    const list = [data];
    this.formRegistrarAcuerdo.reset();
    this.formRegistrarAcuerdo.controls.asignacionId.setValue(this.asignacionId);
    this.formRegistrarAcuerdo.controls.ejecutivoId.setValue(this.ejecutivoId);
    this.formRegistrarAcuerdo.controls.socioId.setValue(this.credito.socioId);
    this.formRegistrarAcuerdo.controls.creditoId.setValue(this.credito.id);
    this.formRegistrarAcuerdo.controls.fechaInicio.setValue(this.dateDefault);
    this.spinner.show();
    this.asignacionCarteraService.crearAcuerdoPorAsignacionYCredito(this.asignacionId, list).subscribe(
      res => {
        if (res.exito) {
          this.typeAcuerdo = null;
          Swal.fire('Información de Socio', res.mensaje, 'success');
          this.loadAcuerdosPagos(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
        } else {
          Swal.fire('Información de Socio', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  guardarPlanPago() {
    this.errors = [];
    if (this.formPlanPago.invalid) {
      this.errors.push('Debe llenar los datos obligatorios.');
      return;
    }
    const data: AcuerdoPago = this.formPlanPago.getRawValue();
    const list: AcuerdoPago[] = [];
    let start = data.fechaInicio;
    for (let i = 1; i <= data.plazo; i++) {
      const item = {
        asignacionId: data.asignacionId,
        creditoId: data.creditoId,
        cuota: i,
        descripcion: data.descripcion,
        ejecutivoId: data.ejecutivoId,
        fechaInicio: start,
        intervalo: data.intervalo,
        montoAcordado: data.montoAcordado,
        plazo: data.plazo,
        posibilidadPago: data.posibilidadPago,
        socioId: data.socioId,
        tipoAcuerdo: this.typeAcuerdo
      };
      list.push(item);
      start = FUNC.addDays(item.fechaInicio, data.intervalo);
    }
    this.formPlanPago.reset();
    this.formPlanPago.controls.asignacionId.setValue(this.asignacionId);
    this.formPlanPago.controls.ejecutivoId.setValue(this.ejecutivoId);
    this.formPlanPago.controls.socioId.setValue(this.credito.socioId);
    this.formPlanPago.controls.creditoId.setValue(this.credito.id);
    this.formPlanPago.controls.fechaInicio.setValue(this.dateDefault);
    this.spinner.show();
    this.asignacionCarteraService.crearAcuerdoPorAsignacionYCredito(this.asignacionId, list).subscribe(
      res => {
        if (res.exito) {
          this.typeAcuerdo = null;
          Swal.fire('Información de Socio', res.mensaje, 'success');
          this.loadAcuerdosPagos(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
        } else {
          Swal.fire('Información de Socio', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  eliminarAcuerdoPago(id: number) {
    Swal.fire({
      title: 'Eliminar Acurdo de pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.asignacionCarteraService.eliminarAcuerdoPorAsignacionYCredito(id).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Información de Socio', res.mensaje, 'success');
              this.loadAcuerdosPagos(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
            } else {
              Swal.fire('Información de Socio', res.mensaje, 'error');
            }
            this.spinner.hide();
          },
          err => this.spinner.hide()
        );
      }
    });
  }

  get getCodeMoney() {
    const moneda = this.tipoMonedas.find(i => i.codItem == this.credito.codMoneda);
    return moneda.strValor || '';
  }

  tabSeleccionado(event: NgbTabChangeEvent) {
    this.seccioSeleccionada = event.nextId;
    this.resetFormTelefono();
  }

  cambioSelectTelefono() {
    const select = this.formTelefono.controls.codTipoNotificacion.value;
    if (isNullOrUndefined(select) || select == '') {
      this.formTelefono.controls.numero.reset();
      this.formTelefono.controls.codCiudad.reset();
    }
  }

  changeTypeTelefono(event: any) {
    this.typePhone = event;
    this.formTelefono.controls.numero.reset();
    this.formTelefono.controls.codCiudad.reset();
    let flag = null;
    if (event == this.$movil) {
      this.max = 9;
    } else {
      this.max = 6;
      flag = Validators.required;
    }
    this.formTelefono.controls.numero.setValidators([Validators.required, Validators.minLength(this.max)]);
    this.formTelefono.controls.codCiudad.setValidators(flag);
    this.formTelefono.controls.numero.updateValueAndValidity();
    this.formTelefono.controls.codCiudad.updateValueAndValidity();
  }

  guardarTetefono() {
    const phone: Telefono = this.formTelefono.getRawValue();
    phone.personaId = this.socio.id;
    const tel = this.socio.telefonos.find(v => v.codTipoNotificacion == phone.codTipoNotificacion && v.numero == phone.numero);
    if (tel) {
      Swal.fire('Telefono', 'EL teléfono ya esta asociada a una notificación', 'warning');
      return;
    }
    this.spinner.show();
    this.telefonoService.guardar(phone).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Telefono', res.mensaje, 'success');
          this.resetFormTelefono();
        } else {
          Swal.fire('Telefono', res.mensaje, 'error');
        }
        this.buscarSocioById(this.credito.socioId);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  actualizarTelefono() {

  }

  get tipoNotificacionesTelefono() {
    return this.tipoNotificaciones.filter(v => [1, 2, 3, 4, 7].includes(v.codTipoNotificacion));
  }

  get tipoNotificacionesEmails() {
    return this.tipoNotificaciones.filter(v => [5, 6].includes(v.codTipoNotificacion));
  }

  resetFormTelefono() {
    if (this.typeEvent == 1) {
      if (this.seccioSeleccionada == '1') {
        this.title = 'Gestión de telefónos';
      }
      if (this.seccioSeleccionada == '2') {
        this.title = 'Gestión de Correos';
      }
      if (this.seccioSeleccionada == '3') {
        this.title = 'Gestión de Direcciones';
      }
    }

    this.formTelefono.reset();
    this.formTelefono.controls.tipo.setValue(this.$movil);
    this.formTelefono.controls.codCiudad.setValue('');
    this.formTelefono.controls.codTipoNotificacion.setValue('');
    this.formTelefono.controls.codUso.setValue('');
    this.create = true;
  }

  cambioSelectEmails() {
    const select = this.formCorreo.controls.codTipoNotificacion.value;
    if (isNullOrUndefined(select) || select == '') {
      this.formCorreo.controls.email.setValue('');
      this.create = true;
    }
  }

  guardarEmail() {
    if (this.formCorreo.invalid) {
      Swal.fire('Correo', 'Debe ingresar los datos obligatorios', 'warning');
      return;
    }
    const {codTipoNotificacion, email, codUso} = this.formCorreo.getRawValue();
    const notity = this.tipoNotificaciones.find(v => v.codTipoNotificacion == codTipoNotificacion);
    const correo = this.socio.correos.find(i => i.email == email && i.codTipoNotificacion == codTipoNotificacion);
    if (correo) {
      Swal.fire('Correo', 'El correo ya se encuentra registrado para el tipo de notificación seleccionada.', 'warning');
      return;
    }
    const emailDto: Email = {
      personaId: this.socio.id,
      codTipoNotificacion,
      email,
      tipoNotificacion: notity.nombre,
      tipo: codUso
    };
    this.spinner.show();
    this.emailService.crear(emailDto).subscribe(
      res => {
        if (res && res.emailId) {
          Swal.fire('Correo', 'Se registro el correo con éxito.', 'success');
          this.buscarSocioById(this.credito.socioId);
          this.formCorreo.reset();
          this.formCorreo.controls.codTipoNotificacion.setValue('');
          this.formCorreo.controls.email.setValue('');
          this.formCorreo.controls.codUso.setValue('');
        } else {
          Swal.fire('Correo', 'No se pudo registrar el correo.', 'error');
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }
}
