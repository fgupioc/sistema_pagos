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
import {Ubigeo} from '../../../interfaces/ubigeo';
import {UbigeoService} from '../../../servicios/sistema/ubigeo.service';
import {DireccionService} from '../../../servicios/direccion.service';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import {MyNotification} from '../../../interfaces/my-notification';
import {EventosService} from '../../../servicios/eventos.service';
import {EjecutivoCartera} from '../../../models/ejecutivo-cartera';
import {EjecutivoAsignacion} from '../../../interfaces/ejecutivo-asignacion';
import {Tarea} from '../../../interfaces/tarea';
import {CreditoGestion} from '../../../interfaces/credito-gestion';
import {ShowImagenComponent} from '../../../componentes/show-imagen/show-imagen.component';
import {environment} from '../../../../environments/environment';
import {TareaActividad} from '../../../interfaces/tarea-actividad';

@Component({
  selector: 'app-supervisor-credito-socio',
  templateUrl: './supervisor-credito-socio.component.html',
  styleUrls: ['./supervisor-credito-socio.component.css']
})
export class SupervisorCreditoSocioComponent implements OnInit {
  urlBaseFotos = environment.signinUrl + '/archivo/images/';
  urlBaseImagenTicket = environment.signinUrl + '/archivo/images-ticket/';
  userLoggedName = '';
  formRecordatorio: FormGroup;
  formPlanPago: FormGroup;
  formRegistrarAcuerdo: FormGroup;
  formTelefono: FormGroup;
  formCorreo: FormGroup;
  formDireccion: FormGroup;
  formTarea: FormGroup;

  credito: Credito;
  creditoId: any;
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

  tipoViviendas: TablaMaestra[] = [];
  tipoVias: TablaMaestra[] = [];
  tipoSecciones: TablaMaestra[] = [];
  tipoZonas: TablaMaestra[] = [];
  tiposSectores: TablaMaestra[] = [];
  tipoDirecciones: TablaMaestra[] = [];

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  $sectionName = 'Sección';
  $zoneName = 'Zona';
  $sectorName = 'Sector';
  campania: EjecutivoCartera;

  showNewTask = false;

  misTableros: EjecutivoAsignacion[] = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  countries: CreditoGestion[];
  acciones: CreditoGestion[] = [];
  acuerdosPagoTemp: AcuerdoPago[] = [];

  archivos: any[] = [];
  cargandoImagenes = false;
  pagos: any[] = [];

  actividades: any[];
  msgSending = false;
  comentario = '';

  ejecutivo: any;

  constructor(
    public auth: AutenticacionService,
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
    private emailService: EmailService,
    private ubigeoService: UbigeoService,
    private direccionService: DireccionService,
    private eventosService: EventosService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.userLoggedName = auth.loggedUser.alias;
    activatedRoute.params.subscribe(({asignacionId, creditoId}) => {
      if (asignacionId == undefined || asignacionId == 'undefined') {
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-asignaciones');
      }
      if (asignacionId) {
        this.ejecutivoId = auth.loggedUser.id;
        this.asignacionId = asignacionId;
        const state = this.router.getCurrentNavigation().extras.state;
        this.creditoId = creditoId;
        if (this.creditoId) {
          this.cargarCredito();
        } else {
          router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-asignaciones/${this.creditoId}/detalle`);
        }
      } else {
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-asignaciones');
      }
    });
  }

  ngOnInit() {
    this.listarTipoDirecciones();
    this.listarTipoviviendas();
    this.listarTipoVias();
    this.listarTipoSecciones();
    this.listarTipoZonas();
    this.listarTipoSectores();
    this.listarDepartamentos();
    this.listarTipoActividades();
    this.loadTipoNotificaciones();
    this.loadlistaAcuerdos();
    this.loadEstadosRecordatorios();
    this.loadTipoMonedas();
    this.loadTipoUsoTelefono();
    this.loadTipoUsoEmail();

    if (this.credito) {
      this.cragarInformacion();
    }
    this.listarAcciones(this.creditoId, this.asignacionId);
    if (this.ejecutivoId) {
      this.loadEjecutivo()
      this.listarTablero();
    }
  }

  loadEjecutivo() {
    this.asignacionCarteraService.buscarEjecutivoByCodUsuario(this.ejecutivoId).subscribe(
      res => {
        if (res.exito) {
          this.ejecutivo = res.objeto;
        }
      }
    );
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

  eliminarAcuerdoPago(item: AcuerdoPago) {
    if (this.isAfter(item.fechaInicio)) {
      Swal.fire('Acuerdo de Pago', 'No es posible eliminar.', 'warning');
      return;
    }
    Swal.fire({
      title: 'Eliminar Acurdo de pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.asignacionCarteraService.eliminarAcuerdoPorAsignacionYCredito(item.id).subscribe(
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
    return moneda ? moneda.strValor : '';
  }

  tabSeleccionado(event: NgbTabChangeEvent) {
    this.seccioSeleccionada = event.nextId;
    this.resetFormTelefono();
    this.formCorreo.reset();
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

  cambioManzana(event: any) {
    const value = event.target.value;
    if (value.length > 0) {
      this.formDireccion.controls.lote.setValidators(
        Validators.compose([
          Validators.required
        ]),
      );
      this.formDireccion.controls.lote.updateValueAndValidity();
    } else {
      this.formDireccion.controls.lote.clearValidators();
      this.formDireccion.controls.lote.updateValueAndValidity();
      this.formDireccion.controls.lote.setValue('');
    }
  }

  cambioTipoSeccion(event: any) {
    const value = event.target.value;
    if (Number(value) !== 0) {
      this.formDireccion.controls.numeroSeccion.setValidators(
        Validators.compose([
          Validators.required,
          Validators.pattern(CONST.C_STR_EXP_REGULAR_NUMERO)
        ]),
      );
      this.formDireccion.controls.numeroSeccion.updateValueAndValidity();
      const item = this.tipoSecciones.find(v => v.codItem == value);
      this.$sectionName = item ? item.descripcion : 'Sección';
    } else {
      this.formDireccion.controls.numeroSeccion.clearValidators();
      this.formDireccion.controls.numeroSeccion.updateValueAndValidity();
      this.formDireccion.controls.numeroSeccion.setValue('');
      this.$sectionName = 'Sección';
    }
  }

  cambioTipoZona(event: any) {
    const value = event.target.value;
    if (Number(value) !== 0) {
      const item = this.tipoZonas.find(v => v.codItem == value);
      this.$zoneName = item ? item.descripcion : 'Zona';
    } else {
      this.$zoneName = 'Zona';
    }
  }

  cambioTipoSector(event: any) {
    const value = event.target.value;
    if (Number(value) !== 0) {
      this.formDireccion.controls.nombreSector.setValidators(
        Validators.compose([
          Validators.required
        ]),
      );
      this.formDireccion.controls.nombreSector.updateValueAndValidity();
      const item = this.tiposSectores.find(v => v.codItem == value);
      this.$sectorName = item ? item.descripcion : 'Sector';
    } else {
      this.formDireccion.controls.nombreSector.clearValidators();
      this.formDireccion.controls.nombreSector.updateValueAndValidity();
      this.formDireccion.controls.nombreSector.setValue('');
      this.$sectorName = 'Sector';
    }
  }


  listarDepartamentos() {
    this.ubigeoService.listarDepartamentos().subscribe(
      response => {
        this.departamentos = response;
      },
      error => console.log(error)
    );
  }

  listarProvincias() {
    this.provincias = [];
    this.distritos = [];
    this.formDireccion.controls.provincia.setValue(null);
    this.formDireccion.controls.distrito.setValue(null);

    const codDepartamento = this.formDireccion.controls.departamento.value;
    if (codDepartamento) {
      this.ubigeoService.listarProvincias(codDepartamento).subscribe(
        response => {
          this.provincias = response;
        },
        error => console.log(error)
      );
    }
  }

  listarDistritos() {
    this.distritos = [];
    this.formDireccion.controls.distrito.setValue(null);
    const codDepartamento = this.formDireccion.controls.departamento.value;
    const codProvincia = this.formDireccion.controls.provincia.value;
    if (codDepartamento && codProvincia) {
      this.ubigeoService.listarDistritos(codDepartamento, codProvincia).subscribe(
        response => {
          this.distritos = response;
        },
        error => console.log(error)
      );
    }
  }

  listarTipoDirecciones() {
    this.tablaMaestraService.listarTipoDirecciones().subscribe(
      response => {
        this.tipoDirecciones = response;
      },
      error => console.log(error)
    );
  }

  listarTipoviviendas() {
    this.tablaMaestraService.listarTipoViviendas().subscribe(
      response => {
        this.tipoViviendas = response;
      },
      error => console.log(error)
    );
  }

  listarTipoVias() {
    this.tablaMaestraService.listarTipoVias().subscribe(
      response => {
        this.tipoVias = response;
      },
      error => console.log(error)
    );
  }

  listarTipoSecciones() {
    this.tablaMaestraService.listarTipoSecciones().subscribe(
      response => {
        this.tipoSecciones = response;
      },
      error => console.log(error)
    );
  }

  listarTipoZonas() {
    this.tablaMaestraService.listarTipoZonas().subscribe(
      response => {
        this.tipoZonas = response;
      },
      error => console.log(error)
    );
  }

  listarTipoSectores() {
    this.tablaMaestraService.listarTipoSectores().subscribe(
      response => {
        this.tiposSectores = response;
      },
      error => console.log(error)
    );
  }

  guardarDireccion() {
    if (this.formDireccion.invalid) {
      Swal.fire('Direccion', 'Debe ingresar los datos obligatorios.', 'warning');
      return;
    }
    this.spinner.show();
    const {departamento, distrito, provincia, ...address} = this.formDireccion.getRawValue();
    address.personaId = this.socio.id;
    address.ubigeo = `${departamento}${distrito}${provincia}`;
    this.$sectionName = 'Sección';
    this.$zoneName = 'Zona';
    this.$sectorName = 'Sector';
    this.formDireccion.reset();
    this.direccionService.guardar(address).subscribe(
      res => {
        if (res.exito) {
          this.buscarSocioById(this.credito.socioId);
        } else {
          Swal.fire('Dirección', res.mensaje, 'error');
          this.spinner.hide();
        }
      },
      err => {
        Swal.fire('Dirección', err.mensaje, 'error');
        this.spinner.hide();
      }
    );
  }

  getNameTipoDireccion(tipoDireccion: string) {
    const item = this.tipoDirecciones.find(i => i.codItem == tipoDireccion);
    return item ? item.descripcion : '';
  }

  mostrarDireccion(dir: Direccion): string {
    let address = '';
    if (dir.tipoVia) {
      address = this.getNombreTipoVia(dir.tipoVia);
    }

    if (dir.nombreVia) {
      address += address != '' ? ' ' + dir.nombreVia : dir.nombreVia;
    }

    if (dir.numero) {
      address += address != '' ? ' NRO ' + dir.numero : 'NRO ' + dir.numero;
    }

    if (dir.manzana) {
      address += address != '' ? ' MZA ' + dir.manzana : 'MZA ' + dir.manzana;
    }

    if (dir.lote) {
      address += address != '' ? ' LOTE ' + dir.lote : 'LOTE ' + dir.lote;
    }
    return address;
  }

  private getNombreTipoVia(tipoVia: string) {
    const item = this.tipoVias.find(i => i.codItem == tipoVia);
    return item ? item.descripcion : '';
  }

  private cargarCredito() {
    this.asignacionCarteraService.buscarCreditoPorId(this.creditoId).subscribe(
      res => {
        if (res.exito) {
          this.credito = res.objeto;
          this.cragarInformacion();
        } else {
          this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-asignaciones/${this.creditoId}/detalle`);
        }
      },
      err => {
        this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-asignaciones/${this.creditoId}/detalle`);
      }
    );
  }

  private cragarInformacion() {
    this.obtenerAsignnacionPorId(this.asignacionId);
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
    this.formDireccion = this.formBuilder.group({
      tipoDireccion: ['', Validators.required],
      tipoVivienda: ['', Validators.required],
      tipoVia: ['', Validators.required],
      nombreVia: ['', Validators.required],
      numero: [''],
      manzana: [''],
      lote: [''],
      tipoSeccion: [''],
      numeroSeccion: [''],
      tipoZona: ['', Validators.required],
      nombreZona: ['', Validators.required],
      tipoSector: [''],
      nombreSector: [''],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
    });

    this.formTarea = this.formBuilder.group({
      tableroTareaId: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      prioridad: [0, [Validators.required]],
      codActividad: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
      horaVencimiento: ['', [Validators.required]],
      horaRecordatorio: [''],
      fechaRecordatorio: [''],
      checkFechaRecordatorio: [false],
      notificacion: [false],
      correo: [false],
    });

    this.refreshCountries();
  }

  isCurrentDate(fecha: string, condicion: string) {
    const date = moment(fecha).format('YYYY-MM-DD');
    if (this.dateDefault == date && condicion != '2') {
      return 'table-primary';
    }
    if (this.dateDefault == date && condicion == '2') {
      return 'table-success';
    }
    if (moment().isAfter(fecha) && condicion != '2') {
      return 'table-danger';
    }
    if (moment().isAfter(fecha) && condicion == '2') {
      return 'table-success';
    }
  }

  isAfter(fecha) {
    return moment(this.dateDefault).isAfter(moment(fecha).format('YYYY-MM-DD'));
  }

  obtenerAsignnacionPorId(asignacionId: any) {
    this.spinner.show();
    this.asignacionCarteraService.obtenerAsignnacionPorId(asignacionId).subscribe(
      res => {
        if (res.exito) {
          this.campania = res.objeto;
        } else {
          this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-asignaciones/${this.creditoId}/detalle`);
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-asignaciones/${this.creditoId}/detalle`);
      }
    );
  }

  get conPermiso() {
    return moment().isBetween(this.campania.startDate, this.campania.endDate);
  }

  crearTablero() {
    Swal.fire({
      title: 'Ingrese un nombre',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: false,
      inputValidator: (value) => {
        if (!value) {
          return 'El nombre es obligatorio.';
        }
      }
    }).then((result) => {
      if (result.value) {
        const data: EjecutivoAsignacion = {
          nombre: result.value,
          slug: FUNC.slugGenerate(result.value),
          ejecutivoId: this.auth.loggedUser.id,
          visibilidad: '01',
        };
        this.spinner.show();
        this.asignacionCarteraService.crearAsignacionTarea(data).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Crear Nuevo Tablero', res.mensaje, 'success');
              this.listarTablero();
            } else {
              Swal.fire('Crear Nuevo Tablero', res.mensaje, 'error');
            }
            this.spinner.hide();
          },
          err => {
            Swal.fire('Crear Nuevo Tablero', 'Ocurrio un error', 'error');
          }
        );
      }
    });
  }

  changeRecordatorio(event: any) {
    if (event.target.checked) {
      if (this.formTarea.controls.fechaVencimiento.value && this.formTarea.controls.horaVencimiento.value) {
        this.formTarea.controls.fechaRecordatorio.setValue(this.formTarea.controls.fechaVencimiento.value);
        this.formTarea.controls.horaRecordatorio.setValue(this.getTime);
      } else {
        Swal.fire('Tarea', 'Debe ingresar una fecha de vencimiento y hora de vencimiento', 'warning');
        this.formTarea.controls.checkFechaRecordatorio.setValue(false);
        return;
      }
    } else {
      this.formTarea.controls.fechaRecordatorio.setValue(null);
      this.formTarea.controls.horaRecordatorio.setValue(null);
    }
  }

  get getTime() {
    if (this.formTarea.controls.horaVencimiento.value) {
      const time = Number(this.formTarea.controls.horaVencimiento.value.slice(0, 2)) - 1;
      return time < 10 ? `0${time}:00` : `${time}:00`;
    } else {
      return '09:00';
    }
  }

  chengeFehcaRecordatorio(event: any) {
    if (moment(this.formTarea.controls.fechaVencimiento.value).isBefore(event)) {
      this.formTarea.controls.fechaRecordatorio.setValue(this.formTarea.controls.fechaVencimiento.value);
    } else {
      if (moment().isAfter(event)) {
        // this.formTarea.controls.fechaRecordatorio.setValue(moment().format('YYYY-MM-DD'));
      } else {
        // this.formTarea.controls.fechaRecordatorio.setValue(event);
      }
    }
  }

  guardarTarea() {
    if (this.formTarea.invalid) {
      Swal.fire('Crear Tarea', 'Debe ingresar los campos obligatorios.', 'warning');
      return;
    }
    const task: Tarea = this.formTarea.getRawValue();
    task.etapaActual = CONST.C_STR_ETAPA_EN_LISTA;
    task.creditoId = this.credito.id;
    task.socioId = this.credito.socioId;
    task.asignacionId = this.credito.asignacionId;
    task.condicion = '0';
    this.spinner.show();
    this.asignacionCarteraService.crearTarea(task.tableroTareaId, task).subscribe(
      res => {
        if (res.exito) {
          this.formTarea.reset();
          this.listarAcciones(this.credito.id, this.credito.asignacionId);
          this.showNewTask = false;
        } else {
          Swal.fire('Crear Tarea', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        Swal.fire('Crear Tarea', 'Ocurrio un error', 'error');
      }
    );
  }

  refreshCountries() {
    this.countries = this.acciones
      .map((country, i) => ({id_: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  showDetalle(i, item: CreditoGestion) {
    this.archivos = [];
    this.pagos = [];
    if ($(`.item_${i}`).hasClass('hidden')) {
      $(`.item-detalle`).addClass('hidden');
      $(`.item_${i}`).removeClass('hidden');
    } else {
      $(`.item-detalle`).addClass('hidden');
    }

    if ($(`.tr_${i}`).hasClass('table-primary')) {
      $(`.tr_${i}`).removeClass('table-primary');
    } else {
      $(`#listaGestiones tbody tr`).removeClass('table-primary');
      $(`.tr_${i}`).addClass('table-primary');
    }
    this.acuerdosPagoTemp = [];
    if (item.tipo == 1) {
      if (item.codRespuesta == '008' || item.codRespuesta == '009') {
        this.acuerdosPagoTemp = this.acuerdosPago.filter(value => String(value.grupo) == item.keyResp);
      }

      if (item.tipoContacto == '5') {
        this.leerAccionPorTarea(item.id);
      }
    }
    if (item.tipo == 3) {
      this.listarActividadPorTarea(item.id);
      this.leerComentarios(item.id);
    }
  }

  leerAccionPorTarea(id: number) {
    this.cargandoImagenes = true;
    this.asignacionCarteraService.leerAccionPorTarea(id).subscribe(
      res => {
        if (res.exito) {
          if (res.objeto) {
            const obj: any = res.objeto;
            this.archivos = obj.archivos;
            this.pagos = res.pagos as any[];
          }
        }
        this.cargandoImagenes = false;
      },
      err => {
        this.cargandoImagenes = false;
      }
    );
  }

  listarActividadPorTarea(tareaId) {
    this.actividades = [];
    this.msgSending = true;
    this.asignacionCarteraService.listarActividadPorTarea(tareaId).subscribe(
      res => {
        if (res.exito) {
          this.actividades = res.objeto as any[];
        }
        this.msgSending = false;
      },
      err => {
        this.msgSending = false;
      }
    );
  }

  leerComentarios(id: any) {
    this.asignacionCarteraService.leerComentariosPorTarea(id).subscribe(
      res => {
        if (res.exito) {
          this.eventosService.leerNotifyEmitter.emit({tipo: '04', id});
        }
      }
    );
  }

  showImagen(urlbase: any, arcivo: any, tipo: any) {
    const modal = this.modalService.open(ShowImagenComponent);
    modal.componentInstance.url = urlbase + arcivo.url;
    modal.componentInstance.tipo = tipo;
    modal.componentInstance.id = arcivo.id;
  }


  guardarCometario(tareaId) {
    if (this.comentario.trim().length == 0) {
      Swal.fire('Crear Comentario', 'Debe ingresar un comentario valido.', 'warning');
      return;
    }
    const comment: TareaActividad = {
      tareaId,
      comentario: this.comentario,
    };
    this.msgSending = true;
    this.spinner.show();
    this.asignacionCarteraService.crearTareaComentario(comment).subscribe(
      res => {
        if (res.exito) {
          this.comentario = '';
          Swal.fire('Crear Comentario', res.mensaje, 'success');
          this.listarActividadPorTarea(tareaId);
        }
        this.spinner.hide();
        this.msgSending = false;
      },
      err => {
        this.spinner.hide();
        this.msgSending = false;
      }
    );
  }


  desactivarActividad(tareaId) {
    Swal.fire({
      text: 'Estas segura de eliminar la actividad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        /*
        this.spinner.show();
        this.gestionAdministrativaService.desactivarTareaComentario(tareaId).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Actividad', res.mensaje, 'success');
              this.spinner.hide();
              this.listarActividadPorTarea(tareaId);
            } else {
              Swal.fire('Actividad', res.mensaje ? res.mensaje : 'Error en el proceso', 'error');
              this.spinner.hide();
            }
          },
          err => {
            Swal.fire('Actividad', 'Error en el proceso', 'error');
            this.spinner.hide();
          }
        );
        */
      }
    });
  }

  listarAcciones(creditoId, asignacionId) {
    this.asignacionCarteraService.buscarCreditoAsignacionAccion(creditoId, asignacionId).subscribe(
      res => {
        if (res.exito) {
          this.acciones = res.acciones;
          this.collectionSize = this.acciones.length;
          this.refreshCountries();
        }
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  listarTablero() {
    this.asignacionCarteraService.listarTableroTareasPorEjecutivo(this.ejecutivoId).subscribe(
      res => {
        this.misTableros = res;
      },
      err => {
      }
    );
  }

}
