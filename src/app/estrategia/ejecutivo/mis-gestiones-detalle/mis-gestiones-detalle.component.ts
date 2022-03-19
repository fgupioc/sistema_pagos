import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Credito} from '../../../interfaces/credito';
import {FUNC} from '../../../comun/FUNC';
import {Cartera, Etapa} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {Persona} from '../../../interfaces/Persona';
import {CONST} from '../../../comun/CONST';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Telefono} from '../../../interfaces/telefono';
import {Email} from '../../../interfaces/email';
import {Direccion} from '../../../interfaces/direccion';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {CreditoGestion} from '../../../interfaces/credito-gestion';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import * as moment from 'moment';
import {AcuerdoPago} from '../../../interfaces/acuerdo-pago';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {EjecutivoCartera} from '../../../models/ejecutivo-cartera';
import {Tarea} from '../../../interfaces/tarea';
import {EjecutivoAsignacion} from '../../../interfaces/ejecutivo-asignacion';
import {EventosService} from '../../../servicios/eventos.service';
import {TelefonoService} from '../../../servicios/telefono.service';
import {isNullOrUndefined} from 'util';
import {TipoNotificacion} from '../../../models/tipo-notificacion';
import {TipoNotificacionService} from '../../../servicios/tipo-notificacion.service';
import {EmailService} from '../../../servicios/email.service';
import {UbigeoService} from '../../../servicios/sistema/ubigeo.service';
import {DireccionService} from '../../../servicios/direccion.service';
import {Ubigeo} from '../../../interfaces/ubigeo';
import {TareaActividad} from '../../../interfaces/tarea-actividad';
import {environment} from '../../../../environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ShowImagenComponent} from '../../../componentes/show-imagen/show-imagen.component';

declare var $: any;

@Component({
  selector: 'app-mis-gestiones-detalle',
  templateUrl: './mis-gestiones-detalle.component.html',
  styleUrls: ['./mis-gestiones-detalle.component.css'],
})
export class MisGestionesDetalleComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  urlBaseFotos = environment.signinUrl + '/archivo/images/';
  urlBaseImagenTicket = environment.signinUrl + '/archivo/images-ticket/';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  countries: CreditoGestion[];

  form: FormGroup;
  formPlanPago: FormGroup;
  formRegistrarAcuerdo: FormGroup;
  formTarea: FormGroup;
  formCorreo: FormGroup;
  formTelefono: FormGroup;
  formEmail: FormGroup;
  formDireccion: FormGroup;
  formWhatsapp: FormGroup;

  nroCredito: any;
  credito: Credito;
  cartera: Cartera;
  funciones = FUNC;
  socio: Persona;
  etapa: Etapa;
  showRespuesta = false;
  tipoVias: TablaMaestra[] = [];
  acciones: CreditoGestion[] = [];

  gestiones: TablaMaestra[] = [];
  $respuestasBack: TablaMaestra[] = [];
  respuestas: TablaMaestra[] = [];
  tiposContacto: TablaMaestra[] = [];
  tipoDirecciones: TablaMaestra[] = [];
  typeAcuerdo = 1;
  errors: string[] = [];
  dateDefault = moment(new Date()).format('YYYY-MM-DD');
  hourDefault = moment().format('LT');
  codAcuedoPago = '008';
  codClienteComprometePago = '009';
  acuerdosPago: AcuerdoPago[] = [];
  estadosRecordatorio: TablaMaestra[] = [];
  listaAcuerdos: TablaMaestra[] = [];
  campania: EjecutivoCartera;
  tipoActividades: TablaMaestra[] = [];
  misTableros: EjecutivoAsignacion[] = [];
  showNewTask = false;
  showNewEmail = false;
  $body: string;
  showNewPhone = false;

  typePhone = '01';
  max = 9;
  $fijo = 2;
  $movil = 1;
  $sectionName = 'Sección';
  $zoneName = 'Zona';
  $sectorName = 'Sector';

  tipoNotificaciones: TipoNotificacion[] = [];
  tiposUsoTelefono: TablaMaestra[] = [];
  tipoUsoEmail: TablaMaestra[] = [];
  showNewAddress = false;

  tipoViviendas: TablaMaestra[] = [];
  tipoSecciones: TablaMaestra[] = [];
  tipoZonas: TablaMaestra[] = [];
  tiposSectores: TablaMaestra[] = [];

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  acuerdosPagoTemp: AcuerdoPago[] = [];

  $condicion = '0';
  userLoggedName = '';
  comentario = '';
  actividades: any[];
  msgSending = false;
  iniciarTarea = false;
  archivos: any[] = [];
  cargandoImagenes = false;
  pagos: any[] = [];
  showNewWhatsapp = false;
  $target = '';
  $codRespuesta = '';
  $tipoGestion = '';
  $duracion = 0;

  $detalles: any[] = [];
  $horario: any[] = [];
  $opneClass = false;

  constructor(
    public auth: AutenticacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private gestionAdministrativaService: GestionAdministrativaService,
    private formBuilder: FormBuilder,
    private tablaMaestraService: MaestroService,
    private asignacionCarteraService: AsignacionCarteraService,
    private eventosService: EventosService,
    private telefonoService: TelefonoService,
    private tipoNotificacionService: TipoNotificacionService,
    private emailService: EmailService,
    private ubigeoService: UbigeoService,
    private direccionService: DireccionService,
    private modalService: NgbModal
  ) {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.dtOptions.order = [[0, 'asc']];
    activatedRoute.params.subscribe(
      ({nroCredito}) => (this.nroCredito = nroCredito)
    );
    this.userLoggedName = auth.loggedUser.alias;
  }

  ngOnInit() {
    this.listarTipoDirecciones();
    this.listarTipoviviendas();
    this.listarTipoSecciones();
    this.listarTipoZonas();
    this.listarTipoSectores();
    this.listarDepartamentos();
    this.listarTipoVias();
    this.listarTiposGestiones();
    this.listarTiposRespuestas();
    this.listarTiposContactos();
    this.loadEstadosRecordatorios();
    this.loadlistaAcuerdos();
    this.listarTipoActividades();
    this.listarTablero();
    this.loadTipoNotificaciones();
    this.loadTipoUsoTelefono();
    this.loadTipoUsoEmail();

    for (let index = 1; index <= 12; index++) {
      if (index < 10) {
        this.$horario.push('0' + index);
      } else {
        this.$horario.push(index);
      }
    }

    if (this.nroCredito) {
      this.loadCredito();
    }
    this.form = this.formBuilder.group({
      tipoGestion: ['001', Validators.required],
      tipoContacto: ['1', Validators.required],
      telefono: [''],
      duracion: [''],
      correo: [''],
      direccion: [''],
      codRespuesta: ['001', Validators.required],
      comentario: ['', Validators.required],
    });
    this.formRegistrarAcuerdo = this.formBuilder.group({
      asignacionId: [],
      ejecutivoId: [],
      socioId: [],
      creditoId: [],
      montoAcordado: ['', [Validators.required]],
      posibilidadPago: ['', [Validators.required]],
      fechaInicio: [this.dateDefault, [Validators.required]],
      horaIncio: ['', [Validators.required]],
    });

    this.formPlanPago = this.formBuilder.group({
      asignacionId: [],
      ejecutivoId: [],
      socioId: [],
      creditoId: [],
      descripcion: ['', [Validators.required]],
      plazo: [null, [Validators.required]],
      montoAcordado: [null, [Validators.required]],
      intervalo: [null, [Validators.required]],
      fechaInicio: [this.dateDefault, [Validators.required]],
      posibilidadPago: ['', [Validators.required]],
    });

    this.formTarea = this.formBuilder.group({
      tableroTareaId: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      prioridad: [0, [Validators.required]],
      codActividad: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
      horaVencimiento: [''],
      horaRecordatorio: [''],
      fechaRecordatorio: [''],
      checkFechaRecordatorio: [false],
      notificacion: [false],
      correo: [false],
      horaA: [''],
      minA: [''],
      tiempoA: [''],
      horaB: [''],
      minB: [''],
      tiempoB: [''],
    });

    this.formTelefono = this.formBuilder.group({
      tipo: [this.$movil, Validators.required],
      operador: ['', Validators.required],
      numero: ['', [Validators.required, Validators.minLength(this.max)]],
      codCiudad: [''],
      codTipoNotificacion: ['', [Validators.required]],
      codUso: ['', [Validators.required]],
    });

    this.formEmail = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      codTipoNotificacion: ['', [Validators.required]],
      codUso: ['', [Validators.required]],
    });

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

    this.$body = `\n${this.auth.loggedUser.alias}\n${this.auth.loggedUser.email}\nEjecutivo de Negocio.`;
    this.formCorreo = this.formBuilder.group({
      asunto: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      mensaje: [this.$body, [Validators.required]],
      url: [false],
    });
    this.formWhatsapp = this.formBuilder.group({
      telefono: ['', [Validators.required]],
      mensaje: [this.$body, [Validators.required]],
      url: [false],
    });

    this.refreshCountries();
  }

  listarTipoDirecciones() {
    this.tablaMaestraService.listarTipoDirecciones().subscribe(
      (response) => {
        this.tipoDirecciones = response;
      },
      (error) => console.log(error)
    );
  }

  loadEstadosRecordatorios() {
    this.tablaMaestraService
      .loadEstadosRecordatorios()
      .subscribe((res) => (this.estadosRecordatorio = res));
  }

  loadlistaAcuerdos() {
    this.tablaMaestraService
      .loadTipoAcuerdos()
      .subscribe((res) => (this.listaAcuerdos = res));
  }

  listarTipoVias() {
    this.tablaMaestraService.listarTipoVias().subscribe(
      (response) => {
        this.tipoVias = response;
      },
      (error) => console.log(error)
    );
  }

  listarTiposGestiones() {
    this.tablaMaestraService.listarTiposGestiones().subscribe(
      (response) => {
        this.gestiones = response;
      },
      (error) => console.log(error)
    );
  }

  listarTiposRespuestas() {
    this.tablaMaestraService.listarTiposRespuestas().subscribe(
      (response) => {
        this.$respuestasBack = response;
        this.respuestas = this.$respuestasBack.filter(
          (i) => i.intValor == 1 || i.intValor == 0
        );
      },
      (error) => console.log(error)
    );
  }

  private listarTipoActividades() {
    this.tablaMaestraService.listarTipoActividades().subscribe((res) => {
      this.tipoActividades = res;
    });
  }

  listarTiposContactos() {
    this.tablaMaestraService.listarTiposContactos().subscribe(
      (response) => {
        this.tiposContacto = response.filter((i) => i.codItem != '3');
      },
      (error) => console.log(error)
    );
  }

  listarAcciones(creditoId, asignacionId) {
    this.gestionAdministrativaService
      .buscarCreditoAsignacionAccion(creditoId, asignacionId)
      .subscribe(
        (res) => {
          if (res.exito) {
            this.acciones = res.acciones;
            this.collectionSize = this.acciones.length;
            this.refreshCountries();
          }
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
        }
      );
  }

  loadCredito() {
    this.spinner.show();
    this.gestionAdministrativaService
      .buscarCreditoPorNroCredito(this.nroCredito)
      .subscribe(
        (res) => {
          if (res.exito) {
            this.credito = res.credito;
            this.cartera = res.cartera;
            this.socio = res.socio;
            this.etapa = res.etapa;
            this.campania = res.campania;
            this.loadAcuerdosPagos(
              this.credito.asignacionId,
              this.auth.loggedUser.id,
              this.credito.socioId,
              this.credito.id
            );
            this.listarAcciones(this.credito.id, this.credito.asignacionId);
          } else {
            Swal.fire('Credito', res.mensaje, 'error');
            this.router.navigateByUrl(
              '/auth/gestion-administrativa/mis-gestiones'
            );
            this.spinner.hide();
          }
        },
        (err) => {
          this.spinner.hide();
          Swal.fire('Credito', 'Ocurrio un error', 'error');
          this.router.navigateByUrl(
            '/auth/gestion-administrativa/mis-gestiones'
          );
        }
      );
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

  get regla() {
    if (this.etapa) {
      return `${this.etapa.nombre}(${this.etapa.desde} a ${this.etapa.hasta})`;
    } else {
      return '';
    }
  }

  iniciarGestion() {
    this.showRespuesta = true;
    this.form.controls.tipoGestion.disable();
    this.form.controls.tipoContacto.disable();
  }

  cancelarGestion() {
    this.form.reset({
      tipoGestion: '001',
      tipoContacto: '1',
      telefono: '',
      duracion: '',
      correo: '',
      direccion: '',
      codRespuesta: '001',
      comentario: '',
    });
    this.showRespuesta = false;
    this.form.controls.tipoGestion.enable();
    this.form.controls.tipoContacto.enable();
  }

  public get showPhones(): Telefono[] {
    const phones: Telefono[] = [];
    if (this.socio) {
      this.socio.telefonos.forEach((item) => {
        if (item.codTipoNotificacion == CONST.C_INT_LLAMADAS) {
          const exit = phones.find((i) => i.numero == item.numero);
          if (!exit) {
            phones.push(item);
          }
        }
      });
    }

    return phones;
  }

  public get showEmails(): Email[] {
    const index = [CONST.C_INT_MESSAGER, CONST.C_INT_EMAIL];
    const emails: Email[] = [];
    if (this.socio) {
      this.socio.correos.forEach((item) => {
        if (index.includes(item.codTipoNotificacion)) {
          const exit = emails.find((i) => i.email == item.email);
          if (!exit) {
            emails.push(item);
          }
        }
      });
    }

    return emails;
  }

  public get showAddress(): Direccion[] {
    return this.socio.direcciones;
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
    const item = this.tipoVias.find((i) => i.codItem == tipoVia);
    return item ? item.descripcion : '';
  }

  registrarGestion() {
    this.errors = [];
    const data = this.form.getRawValue();
    if (
      this.formRegistrarAcuerdo.invalid &&
      this.showAcuerdoPago &&
      [1, 3, 4].includes(this.typeAcuerdo)
    ) {
      this.errors.push(
        'Debe llenar los datos obligatorios de acuerdo de pago. 1'
      );
      return;
    }

    if (
      this.formPlanPago.invalid &&
      this.showAcuerdoPago &&
      this.typeAcuerdo == 2
    ) {
      this.errors.push(
        'Debe llenar los datos obligatorios de acuerdo de pago. 2'
      );
      return;
    }

    const gestion = this.gestiones.find((i) => i.codItem == data.tipoGestion);
    const contacto = this.tiposContacto.find(
      (i) => i.codItem == data.tipoContacto
    );
    const respuesta = this.respuestas.find(
      (i) => i.codItem == data.codRespuesta
    );

    let target = '';
    if (data.telefono.length > 0) {
      target = data.telefono;
      if (data.duracion > 0) {
        target += ` (${data.duracion}seg).`;
      }
    } else if (data.correo.length > 0) {
      target = data.correo;
    } else if (data.direccion.length > 0) {
      target = data.direccion;
    }

    const accion: CreditoGestion = {
      tipoGestion: data.tipoGestion,
      tipoContacto: data.tipoContacto,
      target,
      codRespuesta: data.codRespuesta,
      comentario: data.comentario,
      duracion: data.duracion,
      usuarioId: this.auth.loggedUser.id,
      ejecutivoNombre: this.auth.loggedUser.alias,
      gestionDescripcion: gestion ? gestion.descripcion : '',
      contactoDescripcion: contacto ? contacto.descripcion : '',
      respuestaDescripcion: respuesta ? respuesta.descripcion : '',
      creditoId: this.credito.id,
      asignacionId: this.credito.asignacionId,
    };

    let listAcuerdo: AcuerdoPago[] = [];
    if (
      this.formRegistrarAcuerdo.valid &&
      this.showAcuerdoPago &&
      [1, 3, 4].includes(this.typeAcuerdo)
    ) {
      const acuerdoPago: AcuerdoPago = this.formRegistrarAcuerdo.getRawValue();
      acuerdoPago.asignacionId = this.credito.asignacionId;
      acuerdoPago.creditoId = this.credito.id;
      acuerdoPago.ejecutivoId = this.auth.loggedUser.id;
      acuerdoPago.socioId = this.credito.socioId;
      acuerdoPago.tipoAcuerdo = this.typeAcuerdo;
      acuerdoPago.descripcion = 'estandar';
      listAcuerdo = [acuerdoPago];
    }

    if (
      this.formPlanPago.valid &&
      this.showAcuerdoPago &&
      this.typeAcuerdo == 2
    ) {
      const acuerdoPago: AcuerdoPago = this.formPlanPago.getRawValue();
      acuerdoPago.asignacionId = this.credito.asignacionId;
      acuerdoPago.creditoId = this.credito.id;
      acuerdoPago.ejecutivoId = this.auth.loggedUser.id;
      acuerdoPago.socioId = this.credito.socioId;
      let start = acuerdoPago.fechaInicio;
      for (let i = 1; i <= acuerdoPago.plazo; i++) {
        const item = {
          asignacionId: acuerdoPago.asignacionId,
          creditoId: acuerdoPago.creditoId,
          cuota: i,
          descripcion: acuerdoPago.descripcion,
          ejecutivoId: acuerdoPago.ejecutivoId,
          fechaInicio: start,
          intervalo: acuerdoPago.intervalo,
          montoAcordado: acuerdoPago.montoAcordado,
          plazo: acuerdoPago.plazo,
          posibilidadPago: acuerdoPago.posibilidadPago,
          socioId: acuerdoPago.socioId,
          tipoAcuerdo: this.typeAcuerdo,
        };
        listAcuerdo.push(item);
        start = FUNC.addDays(item.fechaInicio, acuerdoPago.intervalo);
      }
    }
    accion.acuerdosPago = listAcuerdo;
    this.spinner.show();
    this.gestionAdministrativaService
      .registrarCreditoAsignacionAccion(accion)
      .subscribe(
        (res) => {
          if (res.exito) {
            Swal.fire('Registrar Gestión', res.mensaje, 'success');
            this.listarAcciones(this.credito.id, this.credito.asignacionId);
            this.loadAcuerdosPagos(
              this.credito.asignacionId,
              this.auth.loggedUser.id,
              this.credito.socioId,
              this.credito.id
            );
            this.form.reset({
              tipoGestion: '001',
              tipoContacto: '1',
              telefono: '',
              duracion: '',
              correo: '',
              direccion: '',
              codRespuesta: '001',
              comentario: '',
            });
            this.showRespuesta = false;
            this.form.controls.tipoGestion.enable();
            this.form.controls.tipoContacto.enable();
            this.formPlanPago.reset();
            this.formRegistrarAcuerdo.reset();
            this.typeAcuerdo = null;
            return;
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  get showAcuerdoPago() {
    const codes = [this.codAcuedoPago, this.codClienteComprometePago];
    return codes.includes(this.form.controls.codRespuesta.value);
  }

  loadAcuerdosPagos(
    asignacionId: any,
    ejecutivoId: any,
    socioId: number,
    creditoId: number
  ) {
    this.asignacionCarteraService
      .listarAcuerdosPorAsignacionYCredito(
        asignacionId,
        ejecutivoId,
        socioId,
        creditoId
      )
      .subscribe((res) => {
        if (res.exito) {
          this.acuerdosPago = res.objeto as AcuerdoPago[];
        }
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

  getNameCondition(condicion: any) {
    const item = this.estadosRecordatorio.find((i) => i.codItem == condicion);
    return item ? item.descripcion : '';
  }

  getNameTipoAcuerdo(condicion: any) {
    const item = this.listaAcuerdos.find((i) => i.codItem == condicion);
    return item ? item.descripcion : '';
  }

  get conPermiso() {
    return moment().isBetween(this.campania.startDate, this.campania.endDate);
  }

  isAfter(fecha) {
    return moment(this.dateDefault).isAfter(moment(fecha).format('YYYY-MM-DD'));
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
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.asignacionCarteraService
          .eliminarAcuerdoPorAsignacionYCredito(item.id)
          .subscribe(
            (res) => {
              if (res.exito) {
                Swal.fire('Información de Socio', res.mensaje, 'success');
                this.loadAcuerdosPagos(
                  this.credito.asignacionId,
                  this.auth.loggedUser.id,
                  this.credito.socioId,
                  this.credito.id
                );
              } else {
                Swal.fire('Información de Socio', res.mensaje, 'error');
              }
              this.spinner.hide();
            },
            (err) => this.spinner.hide()
          );
      }
    });
  }

  listarTablero() {
    this.gestionAdministrativaService
      .listarTableroTareasPorEjecutivo()
      .subscribe(
        (res) => {
          this.misTableros = res;
        },
        (err) => {
        }
      );
  }

  guardarCorreo() {
    if (this.formCorreo.invalid) {
      Swal.fire('Enviar Correo', 'Debe ingresar todos los datos.', 'warning');
      return;
    }

    const {asunto, url, ...correo} = this.formCorreo.getRawValue();
    correo.creditoId = this.credito.id;
    correo.codPersona = this.credito.socioId;
    correo.asignacionId = this.credito.asignacionId;
    const flag = !!url;
    this.spinner.show();
    this.gestionAdministrativaService
      .guardarEnvioEmail(correo, asunto, flag)
      .subscribe(
        (res) => {
          if (res.exito) {
            Swal.fire('Envio de Correo', res.mensaje, 'success');
            this.formCorreo.reset({
              aunto: '',
              correo: '',
              mensaje: this.$body,
            });
            this.listarAcciones(this.credito.id, this.credito.asignacionId);
            this.showNewEmail = false;
          } else {
            Swal.fire('Envio de Correo', res.mensaje, 'error');
          }
          this.spinner.hide();
        },
        (err) => {
          Swal.fire('Envio de Correo', 'Ocurrio un error', 'success');
          this.spinner.hide();
        }
      );
  }

  getNameTipoDireccion(tipoDireccion: string) {
    const item = this.tipoDirecciones.find((i) => i.codItem == tipoDireccion);
    return item ? item.descripcion : '';
  }

  guardarTetefono() {
    const phone: Telefono = this.formTelefono.getRawValue();
    phone.personaId = this.socio.id;
    const tel = this.socio.telefonos.find(
      (v) =>
        v.codTipoNotificacion == phone.codTipoNotificacion &&
        v.numero == phone.numero
    );
    if (tel) {
      Swal.fire(
        'Teléfono',
        'EL teléfono ya esta asociada a una notificación',
        'warning'
      );
      return;
    }
    this.spinner.show();
    this.telefonoService.guardar(phone).subscribe(
      (res) => {
        if (res.exito) {
          Swal.fire('Teléfono', res.mensaje, 'success');
          this.resetFormTelefono();
          this.loadCredito();
          this.showNewPhone = false;
        } else {
          Swal.fire('Teléfono', res.mensaje, 'error');
          this.spinner.hide();
        }
      },
      () => this.spinner.hide()
    );
  }

  resetFormTelefono() {
    this.formTelefono.reset();
    this.formTelefono.controls.tipo.setValue(this.$movil);
    this.formTelefono.controls.codCiudad.setValue('');
    this.formTelefono.controls.codTipoNotificacion.setValue('');
    this.formTelefono.controls.codUso.setValue('');
  }

  cambioSelectTelefono() {
    const select = this.formTelefono.controls.codTipoNotificacion.value;
    if (isNullOrUndefined(select) || select == '') {
      this.formTelefono.controls.numero.reset();
      this.formTelefono.controls.codCiudad.reset();
    }
  }

  get tipoNotificacionesTelefono() {
    return this.tipoNotificaciones.filter((v) =>
      [1, 2, 3, 4, 7].includes(v.codTipoNotificacion)
    );
  }

  get tipoNotificacionesEmails() {
    return this.tipoNotificaciones.filter((v) =>
      [5, 6].includes(v.codTipoNotificacion)
    );
  }

  private loadTipoNotificaciones() {
    this.tipoNotificacionService
      .getAll()
      .subscribe((res) => (this.tipoNotificaciones = res));
  }

  loadTipoUsoTelefono() {
    this.tablaMaestraService
      .listarTipoUso()
      .subscribe((res) => (this.tiposUsoTelefono = res));
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
    this.formTelefono.controls.numero.setValidators([
      Validators.required,
      Validators.minLength(this.max),
    ]);
    this.formTelefono.controls.codCiudad.setValidators(flag);
    this.formTelefono.controls.numero.updateValueAndValidity();
    this.formTelefono.controls.codCiudad.updateValueAndValidity();
  }

  cambioSelectEmails() {
    const select = this.formEmail.controls.codTipoNotificacion.value;
    if (isNullOrUndefined(select) || select == '') {
      this.formEmail.controls.email.setValue('');
    }
  }

  private loadTipoUsoEmail() {
    this.tablaMaestraService
      .loadTipoUsoEmail()
      .subscribe((res) => (this.tipoUsoEmail = res));
  }

  guardarEmail() {
    if (this.formEmail.invalid) {
      Swal.fire('Correo', 'Debe ingresar los datos obligatorios', 'warning');
      return;
    }
    const {codTipoNotificacion, email, codUso} = this.formEmail.getRawValue();
    const notity = this.tipoNotificaciones.find(
      (v) => v.codTipoNotificacion == codTipoNotificacion
    );
    const correo = this.socio.correos.find(
      (i) => i.email == email && i.codTipoNotificacion == codTipoNotificacion
    );
    if (correo) {
      Swal.fire(
        'Correo',
        'El correo ya se encuentra registrado para el tipo de notificación seleccionada.',
        'warning'
      );
      return;
    }
    const emailDto: Email = {
      personaId: this.socio.id,
      codTipoNotificacion,
      email,
      tipoNotificacion: notity.nombre,
      tipo: codUso,
    };
    this.spinner.show();
    this.emailService.crear(emailDto).subscribe(
      (res) => {
        if (res && res.emailId) {
          Swal.fire('Correo', 'Se registró el correo con éxito.', 'success');
          this.formEmail.reset({
            codTipoNotificacion: '',
            email: '',
            codUso: '',
          });
          this.loadCredito();
          this.showNewEmail = false;
        } else {
          Swal.fire('Correo', 'No se pudo registrar el correo.', 'error');
          this.spinner.hide();
        }
      },
      () => this.spinner.hide()
    );
  }

  listarTipoviviendas() {
    this.tablaMaestraService.listarTipoViviendas().subscribe(
      (response) => {
        this.tipoViviendas = response;
      },
      (error) => console.log(error)
    );
  }

  listarTipoSecciones() {
    this.tablaMaestraService.listarTipoSecciones().subscribe(
      (response) => {
        this.tipoSecciones = response;
      },
      (error) => console.log(error)
    );
  }

  listarTipoZonas() {
    this.tablaMaestraService.listarTipoZonas().subscribe(
      (response) => {
        this.tipoZonas = response;
      },
      (error) => console.log(error)
    );
  }

  listarTipoSectores() {
    this.tablaMaestraService.listarTipoSectores().subscribe(
      (response) => {
        this.tiposSectores = response;
      },
      (error) => console.log(error)
    );
  }

  listarDepartamentos() {
    this.ubigeoService.listarDepartamentos().subscribe(
      (response) => {
        this.departamentos = response;
      },
      (error) => console.log(error)
    );
  }

  cambioManzana(event: any) {
    const value = event.target.value;
    if (value.length > 0) {
      this.formDireccion.controls.lote.setValidators(
        Validators.compose([Validators.required])
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
          Validators.pattern(CONST.C_STR_EXP_REGULAR_NUMERO),
        ])
      );
      this.formDireccion.controls.numeroSeccion.updateValueAndValidity();
      const item = this.tipoSecciones.find((v) => v.codItem == value);
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
      const item = this.tipoZonas.find((v) => v.codItem == value);
      this.$zoneName = item ? item.descripcion : 'Zona';
    } else {
      this.$zoneName = 'Zona';
    }
  }

  cambioTipoSector(event: any) {
    const value = event.target.value;
    if (Number(value) !== 0) {
      this.formDireccion.controls.nombreSector.setValidators(
        Validators.compose([Validators.required])
      );
      this.formDireccion.controls.nombreSector.updateValueAndValidity();
      const item = this.tiposSectores.find((v) => v.codItem == value);
      this.$sectorName = item ? item.descripcion : 'Sector';
    } else {
      this.formDireccion.controls.nombreSector.clearValidators();
      this.formDireccion.controls.nombreSector.updateValueAndValidity();
      this.formDireccion.controls.nombreSector.setValue('');
      this.$sectorName = 'Sector';
    }
  }

  listarProvincias() {
    this.provincias = [];
    this.distritos = [];
    this.formDireccion.controls.provincia.setValue(null);
    this.formDireccion.controls.distrito.setValue(null);

    const codDepartamento = this.formDireccion.controls.departamento.value;
    if (codDepartamento) {
      this.ubigeoService.listarProvincias(codDepartamento).subscribe(
        (response) => {
          this.provincias = response;
        },
        (error) => console.log(error)
      );
    }
  }

  listarDistritos() {
    this.distritos = [];
    this.formDireccion.controls.distrito.setValue(null);
    const codDepartamento = this.formDireccion.controls.departamento.value;
    const codProvincia = this.formDireccion.controls.provincia.value;
    if (codDepartamento && codProvincia) {
      this.ubigeoService
        .listarDistritos(codDepartamento, codProvincia)
        .subscribe(
          (response) => {
            this.distritos = response;
          },
          (error) => console.log(error)
        );
    }
  }

  guardarDireccion() {
    if (this.formDireccion.invalid) {
      Swal.fire(
        'Direccion',
        'Debe ingresar los datos obligatorios.',
        'warning'
      );
      return;
    }
    this.spinner.show();
    const {departamento, distrito, provincia, ...address} =
      this.formDireccion.getRawValue();
    address.personaId = this.socio.id;
    address.ubigeo = `${departamento}${distrito}${provincia}`;
    this.direccionService.guardar(address).subscribe(
      (res) => {
        if (res.exito) {
          Swal.fire('Dirección', res.mensaje, 'success');
          this.$sectionName = 'Sección';
          this.$zoneName = 'Zona';
          this.$sectorName = 'Sector';
          this.formDireccion.reset();
          this.loadCredito();
          this.showNewAddress = false;
        } else {
          Swal.fire('Dirección', res.mensaje, 'error');
          this.spinner.hide();
        }
      },
      (err) => {
        Swal.fire('Dirección', err.mensaje, 'error');
        this.spinner.hide();
      }
    );
  }

  refreshCountries() {
    this.countries = this.acciones
      .map((country, i) => ({id_: i + 1, ...country}))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }

  showDetalle(i, item: CreditoGestion) {
    this.archivos = [];
    this.pagos = [];
    this.$target = '';
    this.$codRespuesta = '';
    this.$tipoGestion = '';
    this.$duracion = 0;
    this.$condicion = '0';

    if ($(`.item_${i}`).hasClass('hidden')) {
      $(`.item-detalle`).addClass('hidden');
      $(`.item_${i}`).removeClass('hidden');
    } else {
      $(`.item-detalle`).addClass('hidden');
    }

    if ($(`.tr_${i}`).hasClass('table-primary')) {
      $(`.tr_${i}`).removeClass('table-primary');
      this.$opneClass = false;
    } else {
      $(`#listaGestiones tbody tr`).removeClass('table-primary');
      $(`.tr_${i}`).addClass('table-primary');
      this.$opneClass = true;
    }
    this.acuerdosPagoTemp = [];
    if (item.tipo == 1) {
      if (item.codRespuesta == '008' || item.codRespuesta == '009') {
        this.acuerdosPagoTemp = this.acuerdosPago.filter(
          (value) => String(value.grupo) == item.keyResp
        );
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

  actualizarTarea(item: CreditoGestion) {
    if (!this.$condicion) {
      return;
    }

    this.spinner.show();
    this.gestionAdministrativaService
      .actualizarTareaCondicion(
        item.id,
        this.$condicion,
        item.comentario,
        this.$tipoGestion,
        this.$target,
        this.$codRespuesta,
        this.$duracion
      )
      .subscribe(
        (res) => {
          if (res.exito) {
            this.$target = '';
            this.$codRespuesta = '';
            this.$tipoGestion = '';
            this.$duracion = 0;
            Swal.fire('Actualizar Tarea', res.mensaje, 'success');
            // this.eventosService.leerNotifyEmitter.emit({tipo: '04', id: item.id});
            this.$opneClass = true;
            this.updateNotifications({tipo: '04', id: item.id});
            this.$condicion = '0';
            this.listarAcciones(this.credito.id, this.credito.asignacionId);
            this.spinner.hide();
          } else {
            Swal.fire('Actualizar Tarea', res.mensaje, 'error');
            this.spinner.hide();
          }
        },
        (err) => {
          Swal.fire('Actualizar Tarea', 'Ocurrio un error', 'error');
          this.spinner.hide();
        }
      );
  }

  listarActividadPorTarea(tareaId) {
    this.actividades = [];
    this.msgSending = true;
    this.gestionAdministrativaService
      .listarActividadPorTarea(tareaId)
      .subscribe(
        (res) => {
          if (res.exito) {
            this.actividades = res.objeto as any[];
          }
          this.msgSending = false;
        },
        (err) => {
          this.msgSending = false;
        }
      );
  }

  guardarCometario(tareaId) {
    if (this.comentario.trim().length == 0) {
      Swal.fire(
        'Crear Comentario',
        'Debe ingresar un comentario valido.',
        'warning'
      );
      return;
    }
    const comment: TareaActividad = {
      tareaId,
      comentario: this.comentario,
    };
    this.msgSending = true;
    this.spinner.show();
    this.gestionAdministrativaService.crearTareaComentario(comment).subscribe(
      (res) => {
        if (res.exito) {
          this.comentario = '';
          Swal.fire('Crear Comentario', res.mensaje, 'success');
          this.listarActividadPorTarea(tareaId);
        }
        this.spinner.hide();
        this.msgSending = false;
      },
      (err) => {
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
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.gestionAdministrativaService
          .desactivarTareaComentario(tareaId)
          .subscribe(
            (res) => {
              if (res.exito) {
                Swal.fire('Actividad', res.mensaje, 'success');
                this.spinner.hide();
                this.listarActividadPorTarea(tareaId);
              } else {
                Swal.fire(
                  'Actividad',
                  res.mensaje ? res.mensaje : 'Error en el proceso',
                  'error'
                );
                this.spinner.hide();
              }
            },
            (err) => {
              Swal.fire('Actividad', 'Error en el proceso', 'error');
              this.spinner.hide();
            }
          );
      }
    });
  }

  iniciarProcesoTarea(item: CreditoGestion) {
    this.iniciarTarea = true;
    this.gestionAdministrativaService.iniciarTarea(item.id).subscribe(
      (res) => {
        if (res.exito) {
          item.codRespuesta = '02';
          // this.eventosService.leerNotifyEmitter.emit({tipo: '04'});
          this.$opneClass = true;
          this.updateNotifications({tipo: '04'});
        } else {
          Swal.fire('Iniciar Tarea', res.mensaje ? res.mensaje : '', 'error');
        }
        this.iniciarTarea = false;
      },
      (err) => {
        Swal.fire('Iniciar Tarea', 'Ocurrio un error en el proceso.', 'error');
        this.iniciarTarea = false;
      }
    );
  }

  leerComentarios(id: any) {
    this.gestionAdministrativaService
      .leerComentariosPorTarea(id)
      .subscribe((res) => {
        if (res.exito) {
          // this.eventosService.leerNotifyEmitter.emit({tipo: '04', id});
          this.updateNotifications({tipo: '04', id});
        }
      });
  }

  leerAccionPorTarea(id: number) {
    this.cargandoImagenes = true;
    this.gestionAdministrativaService.leerAccionPorTarea(id).subscribe(
      (res) => {
        if (res.exito) {
          if (res.objeto) {
            const obj: any = res.objeto;
            this.archivos = obj.archivos;
            this.pagos = res.pagos as any[];
          }
          // this.eventosService.leerNotifyEmitter.emit({tipo: '05', id});
          this.updateNotifications({tipo: '05', id});
        }
        this.cargandoImagenes = false;
      },
      (err) => {
        this.cargandoImagenes = false;
      }
    );
  }

  showImagen(urlbase: any, arcivo: any, tipo: any) {
    const modal = this.modalService.open(ShowImagenComponent);
    modal.componentInstance.url = urlbase + arcivo.url;
    modal.componentInstance.tipo = tipo;
    modal.componentInstance.id = arcivo.id;
  }

  generarCeros(numero: string, ceros: number) {
    return String(numero).padStart(ceros, '0');
  }

  eviarWhatsapp() {
    if (this.formWhatsapp.invalid) {
      Swal.fire('Enviar Whatsapp', 'Debe ingresar todos los datos.', 'warning');
      return;
    }

    const {url, ...whatsapp} = this.formWhatsapp.getRawValue();
    whatsapp.creditoId = this.credito.id;
    whatsapp.codPersona = this.credito.socioId;
    whatsapp.asignacionId = this.credito.asignacionId;
    const flag = !!url;
    this.spinner.show();
    this.gestionAdministrativaService
      .guardarEnvioWhatsapp(whatsapp, flag)
      .subscribe(
        (res) => {
          if (res.exito) {
            Swal.fire('Envio de Whatsapp', res.mensaje, 'success');
            this.formWhatsapp.reset({numero: '', mensaje: this.$body});
            this.listarAcciones(this.credito.id, this.credito.asignacionId);
            this.showNewWhatsapp = false;
          } else {
            Swal.fire('Envio de Whatsapp', res.mensaje, 'error');
          }
          this.spinner.hide();
        },
        (err) => {
          Swal.fire('Envio de Whatsapp', 'Ocurrio un error', 'error');
          this.spinner.hide();
        }
      );
  }

  cambioGestion(event: any) {
    this.respuestas = this.$respuestasBack.filter(
      (i) => i.intValor == Number(event) || i.intValor == 0
    );
    this.$detalles = [];
  }

  respuestaSeleccionada(event: any) {
    this.$detalles = [];
    const res = this.respuestas.find((i) => i.codItem == event);
    this.$detalles = res ? res.strValor.split(',') : [];
  }

  updateNotifications(data: any) {
    console.log(this.$opneClass);
    if (this.$opneClass) {
      console.log(data);
      this.eventosService.leerNotifyEmitter.emit(data);
      this.$opneClass = false;
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

  saveTask(data: any) {
    if (!data.showNewTask) {
      this.showNewTask = data.showNewTask;
      this.$detalles = [];
    }
    if (data.task) {
      this.spinner.show();
      this.gestionAdministrativaService
        .crearTarea(data.task.tableroTareaId, data.task)
        .subscribe(
          (res) => {
            if (res.exito) {
              this.formTarea.reset();
              this.listarAcciones(this.credito.id, this.credito.asignacionId);
              this.showNewTask = false;
              // this.eventosService.leerNotifyEmitter.emit({tipo: '04'});
              this.$opneClass = true;
              this.updateNotifications({tipo: '04'});
            } else {
              Swal.fire('Crear Tarea', res.mensaje, 'error');
            }
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            Swal.fire('Crear Tarea', 'Ocurrio un error', 'error');
          }
        );
    }
  }
}
