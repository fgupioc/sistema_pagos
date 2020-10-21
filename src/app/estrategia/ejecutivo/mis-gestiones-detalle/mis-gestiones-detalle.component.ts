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

@Component({
  selector: 'app-mis-gestiones-detalle',
  templateUrl: './mis-gestiones-detalle.component.html',
  styleUrls: ['./mis-gestiones-detalle.component.css']
})
export class MisGestionesDetalleComponent implements OnInit {
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

  creditoId: any;
  credito: Credito;
  cartera: Cartera;
  funciones = FUNC;
  socio: Persona;
  etapa: Etapa;
  showRespuesta = false;
  tipoVias: TablaMaestra[] = [];
  acciones: CreditoGestion[] = [];

  gestiones: TablaMaestra[] = [];
  respuestas: TablaMaestra[] = [];
  tiposContacto: TablaMaestra[] = [];
  tipoDirecciones: TablaMaestra[] = [];
  typeAcuerdo = 1;
  errors: string[] = [];
  dateDefault = moment(new Date()).format('YYYY-MM-DD');
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
  ) {
    activatedRoute.params.subscribe(({creditoId}) => this.creditoId = creditoId);
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

    if (this.creditoId) {
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
      horaVencimiento: ['', [Validators.required]],
      horaRecordatorio: [''],
      fechaRecordatorio: [''],
      checkFechaRecordatorio: [false],
      notificacion: [false],
      correo: [false],
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
      email: ['', [
        Validators.required,
        Validators.email
      ]],
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
    });

    this.refreshCountries();
  }

  listarTipoDirecciones() {
    this.tablaMaestraService.listarTipoDirecciones().subscribe(
      response => {
        this.tipoDirecciones = response;
      },
      error => console.log(error)
    );
  }

  loadEstadosRecordatorios() {
    this.tablaMaestraService.loadEstadosRecordatorios().subscribe(
      res => this.estadosRecordatorio = res
    );
  }

  loadlistaAcuerdos() {
    this.tablaMaestraService.loadTipoAcuerdos().subscribe(
      res => this.listaAcuerdos = res
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

  listarTiposGestiones() {
    this.tablaMaestraService.listarTiposGestiones().subscribe(
      response => {
        this.gestiones = response;
      },
      error => console.log(error)
    );
  }

  listarTiposRespuestas() {
    this.tablaMaestraService.listarTiposRespuestas().subscribe(
      response => {
        this.respuestas = response;
      },
      error => console.log(error)
    );
  }

  private listarTipoActividades() {
    this.tablaMaestraService.listarTipoActividades().subscribe(
      res => {
        this.tipoActividades = res;
      }
    );
  }

  listarTiposContactos() {
    this.tablaMaestraService.listarTiposContactos().subscribe(
      response => {
        this.tiposContacto = response.filter(i => i.codItem != '3');
      },
      error => console.log(error)
    );
  }

  listarAcciones(creditoId, asignacionId) {
    this.gestionAdministrativaService.buscarCreditoAsignacionAccion(creditoId, asignacionId).subscribe(
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


  loadCredito() {
    this.spinner.show();
    this.gestionAdministrativaService.buscarCreditoPorId(this.creditoId).subscribe(
      res => {
        if (res.exito) {
          this.credito = res.credito;
          this.cartera = res.cartera;
          this.socio = res.socio;
          this.etapa = res.etapa;
          this.campania = res.campania;
          this.loadAcuerdosPagos(this.credito.asignacionId, this.auth.loggedUser.id, this.credito.socioId, this.credito.id);
          this.listarAcciones(this.credito.id, this.credito.asignacionId);
        } else {
          Swal.fire('Credito', res.mensaje, 'error');
          this.router.navigateByUrl('/auth/gestion-administrativa/mis-gestiones');
          this.spinner.hide();
        }
      },
      err => {
        this.spinner.hide();
        Swal.fire('Credito', 'Ocurrio un error', 'error');
        this.router.navigateByUrl('/auth/gestion-administrativa/mis-gestiones');
      }
    );
  }

  get typeDocumentDescription() {
    if (this.socio) {
      if (this.socio.personaNatural) {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_DNI);
        return docmento ? docmento.tipoDocumentoDescripcion : '';
      } else {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_RUC);
        return docmento ? docmento.tipoDocumentoDescripcion : '';
      }
    } else {
      return '';
    }
  }

  get documentNumber() {
    if (this.socio) {
      if (this.socio.personaNatural) {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_DNI);
        return docmento ? docmento.numeroDocumento : '';
      } else {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_RUC);
        return docmento ? docmento.numeroDocumento : '';
      }
    } else {
      return '';
    }
  }

  get regla() {
    if (this.etapa) {
      return `${this.etapa.nombre}(${this.etapa.desde} - ${this.etapa.hasta})`;
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

  public get showEmails(): Email[] {
    const index = [CONST.C_INT_MESSAGER, CONST.C_INT_EMAIL];
    const emails: Email[] = [];
    if (this.socio) {
      this.socio.correos.forEach(item => {
        if (index.includes(item.codTipoNotificacion)) {
          const exit = emails.find(i => i.email == item.email);
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
    const item = this.tipoVias.find(i => i.codItem == tipoVia);
    return item ? item.descripcion : '';
  }

  registrarGestion() {
    this.errors = [];
    const data = this.form.getRawValue();
    if (this.formRegistrarAcuerdo.invalid && this.showAcuerdoPago && [1, 3, 4].includes(this.typeAcuerdo)) {
      this.errors.push('Debe llenar los datos obligatorios de acuerdo de pago. 1');
      return;
    }

    if (this.formPlanPago.invalid && this.showAcuerdoPago && this.typeAcuerdo == 2) {
      this.errors.push('Debe llenar los datos obligatorios de acuerdo de pago. 2');
      return;
    }

    const gestion = this.gestiones.find(i => i.codItem == data.tipoGestion);
    const contacto = this.tiposContacto.find(i => i.codItem == data.tipoContacto);
    const respuesta = this.respuestas.find(i => i.codItem == data.codRespuesta);

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
    if (this.formRegistrarAcuerdo.valid && this.showAcuerdoPago && [1, 3, 4].includes(this.typeAcuerdo)) {
      const acuerdoPago: AcuerdoPago = this.formRegistrarAcuerdo.getRawValue();
      acuerdoPago.asignacionId = this.credito.asignacionId;
      acuerdoPago.creditoId = this.credito.id;
      acuerdoPago.ejecutivoId = this.auth.loggedUser.id;
      acuerdoPago.socioId = this.credito.socioId;
      acuerdoPago.tipoAcuerdo = this.typeAcuerdo;
      acuerdoPago.descripcion = 'estandar';
      listAcuerdo = [acuerdoPago];
    }

    if (this.formPlanPago.valid && this.showAcuerdoPago && this.typeAcuerdo == 2) {
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
          tipoAcuerdo: this.typeAcuerdo
        };
        listAcuerdo.push(item);
        start = FUNC.addDays(item.fechaInicio, acuerdoPago.intervalo);
      }
    }
    accion.acuerdosPago = listAcuerdo;
    this.spinner.show();
    this.gestionAdministrativaService.registrarCreditoAsignacionAccion(accion).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Registrar Gestión', res.mensaje, 'success');
          this.listarAcciones(this.credito.id, this.credito.asignacionId);
          this.loadAcuerdosPagos(this.credito.asignacionId, this.auth.loggedUser.id, this.credito.socioId, this.credito.id);
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
      err => {
        this.spinner.hide();
      }
    );
  }

  get showAcuerdoPago() {
    const codes = [this.codAcuedoPago, this.codClienteComprometePago];
    return codes.includes(this.form.controls.codRespuesta.value);
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
    const item = this.estadosRecordatorio.find(i => i.codItem == condicion);
    return item ? item.descripcion : '';
  }

  getNameTipoAcuerdo(condicion: any) {
    const item = this.listaAcuerdos.find(i => i.codItem == condicion);
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
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.asignacionCarteraService.eliminarAcuerdoPorAsignacionYCredito(item.id).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Información de Socio', res.mensaje, 'success');
              this.loadAcuerdosPagos(this.credito.asignacionId, this.auth.loggedUser.id, this.credito.socioId, this.credito.id);
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
    this.spinner.show();
    this.gestionAdministrativaService.crearTarea(task.tableroTareaId, task).subscribe(
      res => {
        if (res.exito) {
          this.formTarea.reset();
          this.listarAcciones(this.credito.id, this.credito.asignacionId);
          this.showNewTask = false;
          this.eventosService.leerNotifyEmitter.emit({tipo: '04'});
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

  get getTime() {
    if (this.formTarea.controls.horaVencimiento.value) {
      const time = Number(this.formTarea.controls.horaVencimiento.value.slice(0, 2)) - 1;
      return time < 10 ? `0${time}:00` : `${time}:00`;
    } else {
      return '09:00';
    }
  }

  listarTablero() {
    this.gestionAdministrativaService.listarTableroTareasPorEjecutivo().subscribe(
      res => {
        this.misTableros = res;
      },
      err => {
      }
    );
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
        this.gestionAdministrativaService.crearAsignacionTarea(data).subscribe(
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
            Swal.fire('Crear Nuevo Tablero', 'Ocurrio un error', 'success');
          }
        );
      }
    });
  }

  guardarCorreo() {
    if (this.formCorreo.invalid) {
      Swal.fire('Enviar Correo', 'Debe ingresar todos los datos.', 'warning');
      return;
    }

    const {asunto, ...correo} = this.formCorreo.getRawValue();
    correo.creditoId = this.credito.id;
    correo.codPersona = this.credito.socioId;
    correo.asignacionId = this.credito.asignacionId;

    this.spinner.show();
    this.gestionAdministrativaService.guardarEnvioEmail(correo, asunto).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Envio de Correo', res.mensaje, 'success');
          this.formCorreo.reset({aunto: '', correo: '', asunto: this.$body});
          this.listarAcciones(this.credito.id, this.credito.asignacionId);
          this.showNewEmail = false;
        } else {
          Swal.fire('Envio de Correo', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => {
        Swal.fire('Envio de Correo', 'Ocurrio un error', 'success');
      }
    );
  }

  getNameTipoDireccion(tipoDireccion: string) {
    const item = this.tipoDirecciones.find(i => i.codItem == tipoDireccion);
    return item ? item.descripcion : '';
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
          this.loadCredito();
          this.showNewPhone = false;
        } else {
          Swal.fire('Telefono', res.mensaje, 'error');
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
    return this.tipoNotificaciones.filter(v => [1, 2, 3, 4, 7].includes(v.codTipoNotificacion));
  }

  get tipoNotificacionesEmails() {
    return this.tipoNotificaciones.filter(v => [5, 6].includes(v.codTipoNotificacion));
  }


  private loadTipoNotificaciones() {
    this.tipoNotificacionService.getAll().subscribe(
      res => this.tipoNotificaciones = res
    );
  }

  loadTipoUsoTelefono() {
    this.tablaMaestraService.listarTipoUso().subscribe(
      res => this.tiposUsoTelefono = res
    );
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

  cambioSelectEmails() {
    const select = this.formEmail.controls.codTipoNotificacion.value;
    if (isNullOrUndefined(select) || select == '') {
      this.formEmail.controls.email.setValue('');
    }
  }

  private loadTipoUsoEmail() {
    this.tablaMaestraService.loadTipoUsoEmail().subscribe(
      res => this.tipoUsoEmail = res
    );
  }


  guardarEmail() {
    if (this.formEmail.invalid) {
      Swal.fire('Correo', 'Debe ingresar los datos obligatorios', 'warning');
      return;
    }
    const {codTipoNotificacion, email, codUso} = this.formEmail.getRawValue();
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
          this.formEmail.reset({
            codTipoNotificacion: '',
            email: '',
            codUso: ''
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
      response => {
        this.tipoViviendas = response;
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

  listarDepartamentos() {
    this.ubigeoService.listarDepartamentos().subscribe(
      response => {
        this.departamentos = response;
      },
      error => console.log(error)
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

    this.direccionService.guardar(address).subscribe(
      res => {
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
      err => {
        Swal.fire('Dirección', err.mensaje, 'error');
        this.spinner.hide();
      }
    );
  }

  refreshCountries() {
    this.countries = this.acciones
      .map((country, i) => ({id_: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}
