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
  formDireccion: FormGroup;

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
  role: string;
  campania: EjecutivoCartera;

  constructor(
    private auth: AutenticacionService,
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

    const {role} = activatedRoute.snapshot.data;
    if (role) {
      this.role = role;
      activatedRoute.params.subscribe(({asignacionId, creditoId}) => {
        if (asignacionId == undefined || asignacionId == 'undefined') {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        }
        if (asignacionId) {
          this.ejecutivoId = auth.loggedUser.id;
          this.asignacionId = asignacionId;
          const state = this.router.getCurrentNavigation().extras.state;
          this.creditoId = creditoId;
          if (this.creditoId) {
            if (state) {
              this.credito = state.credito;
            } else {
              this.cargarCredito();
            }
          } else {
            router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${this.creditoId}/detalle`);
          }
        } else {
          router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        }
      });
    } else {
      activatedRoute.params.subscribe(({ejecutivoId, asignacionId, creditoId}) => {
        if (asignacionId == undefined || ejecutivoId == undefined || asignacionId == 'undefined' || ejecutivoId == 'undefined') {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }

        if (ejecutivoId && asignacionId) {
          this.ejecutivoId = ejecutivoId;
          this.asignacionId = asignacionId;
          const state = this.router.getCurrentNavigation().extras.state;
          this.creditoId = creditoId;
          if (this.creditoId) {
            if (state) {
              this.credito = state.credito;
            } else {
              this.cargarCredito();
            }
          } else {
            router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${ejecutivoId}/listado/${asignacionId}/detalle`);
          }
        } else {
          router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }
      });
    }
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
    return moneda.strValor || '';
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
    console.log(address);
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
          if (this.role) {
            this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${this.creditoId}/detalle`);
          } else {
            this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${this.ejecutivoId}/listado/${this.asignacionId}/detalle`);
          }
        }
      },
      err => {
        if (this.role) {
          this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${this.creditoId}/detalle`);
        } else {
          this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${this.ejecutivoId}/listado/${this.asignacionId}/detalle`);
        }
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
          if (this.role) {
            this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
          } else {
            this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + this.ejecutivoId + '/listado');
          }
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        if (this.role) {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + this.ejecutivoId + '/listado');
        }
      }
    );
  }

  get conPermiso() {
    return moment().isBetween(this.campania.startDate, this.campania.endDate);
  }
}
