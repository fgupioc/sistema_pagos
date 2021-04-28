import {
  Component,
  OnInit,
  ɵSWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__,
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
import { EventosService } from '../../../../../servicios/eventos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Telefono } from '../../../../../interfaces/telefono';
import { Email } from '../../../../../interfaces/email';
import { Direccion } from '../../../../../interfaces/direccion';
import { CONST } from '../../../../../comun/CONST';
import * as moment from 'moment';

@Component({
  selector: 'app-gestion-socio-registrar',
  templateUrl: './gestion-socio-registrar.component.html',
  styleUrls: ['./gestion-socio-registrar.component.css']
})
export class GestionSocioRegistrarComponent implements OnInit {
  @Input() telefonos: Telefono[] = [];
  @Input() correos: Email[] = [];
  @Input() direcciones: Direccion[] = [];
  @Output() enviarSMS = new EventEmitter<any>();

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
}
