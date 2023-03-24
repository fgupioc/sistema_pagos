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
import {Autorizacion} from '../../../comun/autorzacion';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {Comentario} from '../../../models/comentario';
import {ToastrService} from 'ngx-toastr';

declare const $: any;

@Component({
  selector: 'app-credito-socio',
  templateUrl: './credito-socio.component.html',
  styleUrls: ['./credito-socio.component.css']
})
export class CreditoSocioComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  urlBaseFotos = environment.signinUrl + '/archivo/images/';
  urlBaseImagenTicket = environment.signinUrl + '/archivo/images-ticket/';
  userLoggedName = '';
  formRecordatorio: FormGroup;
  formPlanPago: FormGroup;
  formRegistrarAcuerdo: FormGroup;
  formTelefono: FormGroup;
  formCorreo: FormGroup;
  formDireccion: FormGroup;

  credito: Credito;
  nroCredito: any;
  ejecutivoUuid: any;
  asignacionUuid: any;
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
  asignacionId: any;
  ejecutivoId: any;
  A = Autorizacion;

  $commit: Comentario;
  comentarios: Comentario[] = [];

  pagina = 1;
  totalPages = 10;
  totalElements = 0;
  $comentarios: Comentario[] = [];
  loadingComentarios = true;

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
    private eventosService: EventosService,
    public menuS: MenuService,
    public toastr: ToastrService
  ) {
    this.$commit = new Comentario();
    this.$commit.mensaje = '';
    this.$commit.respuesta = '';
    config.backdrop = 'static';
    config.keyboard = false;
    this.userLoggedName = auth.loggedUser.alias;
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.dtOptions.order = [[0, 'asc']];
    const {role} = activatedRoute.snapshot.data;
    if (role) {
      this.role = role;
      activatedRoute.params.subscribe(({asignacionUuid, nroCredito}) => {
        if (asignacionUuid == undefined || asignacionUuid == 'undefined') {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        }
        if (asignacionUuid) {
          this.ejecutivoUuid = auth.loggedUser.uuid;
          this.asignacionUuid = asignacionUuid;
          const state = this.router.getCurrentNavigation().extras.state;
          this.nroCredito = nroCredito;
          if (this.nroCredito) {
            this.$commit.numCredito = nroCredito;
            this.cargarCredito();
          } else {
            router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${this.nroCredito}/detalle`);
          }
        } else {
          router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        }
      });
    } else {
      activatedRoute.params.subscribe(({ejecutivoUuid, asignacionUuid, nroCredito}) => {
        if (asignacionUuid == undefined || ejecutivoUuid == undefined || asignacionUuid == 'undefined' || ejecutivoUuid == 'undefined') {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }

        if (ejecutivoUuid && asignacionUuid) {
          this.ejecutivoUuid = ejecutivoUuid;
          this.asignacionUuid = asignacionUuid;
          const state = this.router.getCurrentNavigation().extras.state;
          this.nroCredito = nroCredito;
          if (this.nroCredito) {
            this.cargarCredito();
            this.obtenerComentarios(nroCredito);
          } else {
            router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${ejecutivoUuid}/listado/${asignacionUuid}/detalle`);
          }
        } else {
          router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }
      });
    }
  }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 1);
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

    if (this.menuS.hasShowAsigCartera(this.A.ASI_CAR_DETAIL_CREDITO)) {
      if (this.credito) {
        this.cragarInformacion();
      }

      if (this.ejecutivoUuid) {
        this.loadEjecutivo();
      }
    }
  }

  loadEjecutivo() {
    this.asignacionCarteraService.buscarEjecutivoByCodUsuario(this.ejecutivoUuid).subscribe(
      res => {
        if (res.exito) {
          this.ejecutivo = res.objeto;
          this.listarTablero(this.ejecutivo.codUsuario);
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

  listarDepartamentos() {
    this.ubigeoService.listarDepartamentos().subscribe(
      response => {
        this.departamentos = response;
      },
      error => console.log(error)
    );
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
    this.asignacionCarteraService.buscarCreditoPorNroCredito(this.nroCredito).subscribe(
      res => {
        if (res.exito) {
          this.credito = res.objeto;
          this.cragarInformacion();
        } else {
          if (this.role) {
            this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${this.nroCredito}/detalle`);
          } else {
            this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${this.ejecutivoUuid}/listado/${this.asignacionUuid}/detalle`);
          }
        }
      },
      err => {
        if (this.role) {
          this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${this.nroCredito}/detalle`);
        } else {
          this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${this.ejecutivoUuid}/listado/${this.asignacionUuid}/detalle`);
        }
      }
    );
  }

  private cragarInformacion() {
    this.$commit.asignacionId = this.asignacionId;
    this.$commit.socioId = this.credito.socioId;
    this.obtenerAsignnacionPorId(this.asignacionUuid);
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

    this.refreshCountries();
  }

  isCurrentDate(fecha: string, condicion: string) {
    const date = moment(fecha).format('YYYY-MM-DD');
    if (condicion == '5') {
      return 'table-success';
    }
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

  isPay(cuota: any) {
    if (cuota.fechaUltimoPago) {
      const date = moment(cuota.fechaUltimoPago).format('YYYY-MM-DD');
      const date2 = moment(cuota.fechaVcmto).format('YYYY-MM-DD');
      if (moment(date).isAfter(date2)) {
        return 'table-danger';
      }
      return 'table-success';
    }

  }

  isAfter(fecha) {
    return moment(this.dateDefault).isAfter(moment(fecha).format('YYYY-MM-DD'));
  }

  obtenerAsignnacionPorId(asignacionUuid: any) {
    this.spinner.show();
    this.asignacionCarteraService.obtenerAsignnacionPorId(asignacionUuid).subscribe(
      res => {
        if (res.exito) {
          this.ejecutivoId = res.ejecutivo.id;
          this.asignacionId = res.objeto.id;
          this.campania = res.objeto;
          this.listarAcciones(this.credito.id, this.asignacionId);
          this.loadAcuerdosPagos(this.asignacionId, this.ejecutivoId, this.credito.socioId, this.credito.id);
        } else {
          if (this.role) {
            this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
          } else {
            this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + this.ejecutivoUuid + '/listado');
          }
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        if (this.role) {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + this.ejecutivoUuid + '/listado');
        }
      }
    );
  }

  get conPermiso() {
    return moment().isBetween(this.campania.startDate, this.campania.endDate);
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
      Swal.fire('Crear Comentario', 'Debe ingresar un comentario válido.', 'warning');
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
        this.spinner.show();
        this.asignacionCarteraService.desactivarTareaComentario(tareaId).subscribe(
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
      },
      error => {
      }
    );
  }

  listarTablero(ejecutivoId: any) {
    this.asignacionCarteraService.listarTableroTareasPorEjecutivo(ejecutivoId).subscribe(
      res => {
        this.misTableros = res;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  saveTask(data: any) {
    if (!data.showNewTask) {
      this.showNewTask = data.showNewTask;
    }
    if (data.task) {
      this.spinner.show();
      this.asignacionCarteraService.crearTarea(data.task.tableroTareaId, data.task).subscribe(
        res => {
          if (res.exito) {
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
  }


  get typeDocumentDescription() {
    if (this.socio) {
      if (this.socio.personaNatural) {
        const docmento = this.socio.documentosIdentidad.find(
          (i) => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_DNI
        );
        return docmento ? docmento.tipoDocumentoDescripcion : '';
      } else {
        const docmento = this.socio.documentosIdentidad.find(
          (i) => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_RUC
        );
        return docmento ? docmento.tipoDocumentoDescripcion : '';
      }
    } else {
      return '';
    }
  }

  get documentNumber() {
    if (this.socio) {
      if (this.socio.personaNatural) {
        const docmento = this.socio.documentosIdentidad.find(
          (i) => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_DNI
        );
        return docmento ? docmento.numeroDocumento : '';
      } else {
        const docmento = this.socio.documentosIdentidad.find(
          (i) => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_RUC
        );
        return docmento ? docmento.numeroDocumento : '';
      }
    } else {
      return '';
    }
  }

  showRespuestas(index: any) {
    const etiqueta = $('#response-' + index);
    const show = $('#show-' + index);
    const hide = $('#hide-' + index);
    if (etiqueta.hasClass('show')) {
      etiqueta.removeClass('show');
      etiqueta.addClass('hidden');
      show.removeClass('hidden');
      show.addClass('show');
      hide.removeClass('show');
      hide.addClass('hidden');
    } else {
      etiqueta.addClass('show');
      etiqueta.removeClass('hidden');
      show.removeClass('show');
      show.addClass('hidden');
      hide.removeClass('hidden');
      hide.addClass('show');
    }
  }

  guardarComentario() {
    this.$commit.asignacionId = this.asignacionId;
    this.$commit.numCredito = this.nroCredito;
    this.$commit.padreId = null;
    this.spinner.show();
    this.asignacionCarteraService.guardarComentario(this.$commit).subscribe(
      res => {
        this.$commit.mensaje = '';
        this.obtenerComentarios(this.nroCredito);
        this.refreshComentarios();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  subComentario(id: number, input: HTMLInputElement) {
    if (input.value == null || input.value.trim().length == 0) {
      this.toastr.warning('Debe ingresar un comentario.');
      return;
    }
    this.$commit.asignacionId = this.asignacionId;
    this.$commit.numCredito = this.nroCredito;
    this.$commit.padreId = id;
    this.$commit.mensaje = input.value;
    this.spinner.show();
    this.asignacionCarteraService.guardarComentario(this.$commit).subscribe(
      res => {
        this.$commit.respuesta = '';
        this.$commit.mensaje = '';
        this.obtenerComentarios(this.nroCredito);
        this.refreshComentarios();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  private obtenerComentarios(nroCredito: any) {
    this.comentarios = [];
    this.spinner.show();
    this.loadingComentarios = true;
    this.asignacionCarteraService.consultarComentarios(nroCredito).subscribe(
      res => {
        this.comentarios = res;
        this.totalElements = this.comentarios.length;
        this.refreshComentarios();
        this.spinner.hide();
        this.loadingComentarios = false;
      },
      err => {
        console.log(err);
        this.loadingComentarios = false;
        this.spinner.hide();
      }
    );
  }

  refreshComentarios() {
    this.$comentarios = this.comentarios
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.pagina - 1) * this.totalPages, (this.pagina - 1) * this.totalPages + this.totalPages);
  }

  getFecha(fecha) {
    return moment(fecha).fromNow();
  }
}
