import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { TablaMaestra } from '../../../../../interfaces/tabla-maestra';
import { AutenticacionService } from '../../../../../servicios/seguridad/autenticacion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaestroService } from '../../../../../servicios/sistema/maestro.service';
import { Telefono } from '../../../../../interfaces/telefono';
import { Email } from '../../../../../interfaces/email';
import { Direccion } from '../../../../../interfaces/direccion';
import { CONST } from '../../../../../comun/CONST';
import * as moment from 'moment';
import {CreditoGestion} from "../../../../../interfaces/credito-gestion";
import {AcuerdoPago} from "../../../../../interfaces/acuerdo-pago";
import {FUNC} from "../../../../../comun/FUNC";
import {EventosService} from "../../../../../servicios/eventos.service";

@Component({
  selector: 'app-gestion-socio-registrar',
  templateUrl: './gestion-socio-registrar.component.html',
  styleUrls: ['./gestion-socio-registrar.component.css']
})
export class GestionSocioRegistrarComponent implements OnInit {
  @Input() telefonos: Telefono[] = [];
  @Input() credito: any;
  @Input() correos: Email[] = [];
  @Input() direcciones: Direccion[] = [];
  @Output() enviarSMS = new EventEmitter<any>();
  @Output() enviarWhatsApp = new EventEmitter<any>();
  @Output() enviarCorreo = new EventEmitter<any>();
  @Output() enviarGestion = new EventEmitter<any>();

  form: FormGroup;
  formPlanPago: FormGroup;
  formRegistrarAcuerdo: FormGroup;

  gestiones: TablaMaestra[] = [];
  respuestas: TablaMaestra[] = [];
  $respuestasBack: TablaMaestra[] = [];
  $detalles: any[] = [];

  tiposContacto: TablaMaestra[] = [];
  showRespuesta = false;
  tipoVias: TablaMaestra[] = [];

  typeAcuerdo = 1;

  dateDefault = moment(new Date()).format('YYYY-MM-DD');
  errors: string[] = [];
  showNewEmail = false;
  showNewWhatsapp = false;
  showNewSMS = false;


  constructor(
    public auth: AutenticacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private tablaMaestraService: MaestroService,
    private eventosService: EventosService

  ) { }

  ngOnInit() {
    this.listarTiposContactos();
    this.listarTiposGestiones();
    this.listarTiposRespuestas();
    this.form = this.formBuilder.group({
      tipoGestion: [{ value: '001', disabled: true}, Validators.required],
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

    this.eventosService.enviarNotifyEmitter.subscribe(({ send }) => (send) ? this.cancelar() : ()=>{});
  }

  cancelar() {
    //this.listarAcciones(this.credito.id, this.credito.asignacionId);
    //this.loadAcuerdosPagos(this.credito.asignacionId, this.auth.loggedUser.id, this.credito.socioId, this.credito.id);
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
  }

  listarTiposGestiones() {
    this.tablaMaestraService.listarTiposGestiones().subscribe(
      response => {
        this.gestiones = response;
      },
      error => console.log(error)
    );
  }

  listarTiposContactos() {
    this.tablaMaestraService.listarTiposContactos().subscribe(
      res => {
        this.tiposContacto = res.filter(i => i.codItem == '1' || i.codItem == '4' );
      },
      error => console.log(error)
    );
  }

  cambioGestion(event: any) {
    this.respuestas = this.$respuestasBack.filter(i => i.intValor == Number(event) || i.intValor == 0);
    this.$detalles = [];
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
    return this.telefonos.filter(i => i.codTipoNotificacion == CONST.C_INT_LLAMADAS);
  }

  public get showEmails(): Email[] {
    return this.correos.filter(i => i.codTipoNotificacion == CONST.C_INT_MESSAGER || i.codTipoNotificacion == CONST.C_INT_EMAIL );
  }

  public get showAddress(): Direccion[] {
    return [];
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

  get showAcuerdoPago() {
    const codes = ['008', '009'];
    return codes.includes(this.form.controls.codRespuesta.value);
  }

  respuestaSeleccionada(event: any) {
    this.$detalles = [];
    const res = this.respuestas.find(i => i.codItem == event);
    this.$detalles = res ? res.strValor.split(',') : [];
  }

  listarTiposRespuestas() {
    this.tablaMaestraService.listarTiposRespuestas().subscribe(
      res => {
        this.$respuestasBack = res;
        this.respuestas = this.$respuestasBack.filter(i => i.intValor == 1 || i.intValor == 0);
      },
      error => console.log(error)
    );
  }

  ingresarGestion() {
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
    this.enviarGestion.emit(accion);
  }
}
