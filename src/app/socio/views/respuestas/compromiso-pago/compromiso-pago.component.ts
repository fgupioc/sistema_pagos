import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SocioInvitadoService} from '../../../../servicios/socio/socio-invitado.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {CreditoGestion} from '../../../../interfaces/credito-gestion';
import {AcuerdoPago} from '../../../../interfaces/acuerdo-pago';
import {FUNC} from '../../../../comun/FUNC';

@Component({
  selector: 'app-compromiso-pago',
  templateUrl: './compromiso-pago.component.html',
  styleUrls: ['./compromiso-pago.component.css']
})
export class CompromisoPagoComponent implements OnInit {
  formPlanPago: FormGroup;
  formRegistrarAcuerdo: FormGroup;
  info: any;
  typeAcuerdo = 0;
  errors: string[] = [];
  dateDefault = moment(new Date()).format('YYYY-MM-DD');
  comment = '';
  token: string;
  numCredito: string;

  page = 1;
  pageSize = 4;
  collectionSize = 0;
  countries: any[];

  $cronograma: AcuerdoPago[] = [];
  tiposAcuerdos: any[] = [
    {id: '1', text: 'AL DÍA'},
    {id: '2', text: 'PLAN DE PAGO'},
    {id: '3', text: 'TOTAL DE LA MORA'},
    {id: '4', text: 'ABONO'},
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private socioInvitadoService: SocioInvitadoService,
    private spinner: NgxSpinnerService
  ) {
    this.refreshCountries();
  }

  ngOnInit() {
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

  enviar() {
    if (this.comment.trim().length == 0 || this.comment.trim().length > 225) {
      Swal.fire('Compromiso de Pago', 'Debe ingresar un comentario', 'warning');
      return;
    }
    if (this.formRegistrarAcuerdo.invalid && [1, 3, 4].includes(Number(this.typeAcuerdo))) {
      Swal.fire('Compromiso de Pago', 'Debe llenar los datos obligatorios de acuerdo de pago.', 'warning');
      return;
    }

    if (this.formPlanPago.invalid && this.typeAcuerdo == 2) {
      Swal.fire('Compromiso de Pago', 'Debe llenar los datos obligatorios de acuerdo de pago.', 'warning');
      return;
    }

    const accion: CreditoGestion = {
      tipoGestion: '001',
      tipoContacto: '5',
      target: 'Crompromiso de Pago',
      codRespuesta: '009',
      comentario: this.comment,
      duracion: 0,
      usuarioId: 0,
      ejecutivoNombre: '',
      gestionDescripcion: '',
      contactoDescripcion: '',
      respuestaDescripcion: '',
      creditoId: 0,
      asignacionId: 0,
    };

    let listAcuerdo: AcuerdoPago[] = [];
    if (this.formRegistrarAcuerdo.valid && [1, 3, 4].includes(Number(this.typeAcuerdo))) {
      const acuerdoPago: AcuerdoPago = this.formRegistrarAcuerdo.getRawValue();
      acuerdoPago.asignacionId = 0;
      acuerdoPago.creditoId = 0;
      acuerdoPago.ejecutivoId = 0;
      acuerdoPago.socioId = 0;
      acuerdoPago.cuota = 1;
      acuerdoPago.tipoAcuerdo = this.typeAcuerdo;
      acuerdoPago.descripcion = 'estandar';
      listAcuerdo = [acuerdoPago];
      this.$cronograma = listAcuerdo;
      this.collectionSize = listAcuerdo.length;
      this.refreshCountries();
    }

    if (this.formPlanPago.valid && this.typeAcuerdo == 2) {
      const acuerdoPago: AcuerdoPago = this.formPlanPago.getRawValue();
      acuerdoPago.asignacionId = 0;
      acuerdoPago.creditoId = 0;
      acuerdoPago.ejecutivoId = 0;
      acuerdoPago.socioId = 0;
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
      this.$cronograma = listAcuerdo;
      this.collectionSize = listAcuerdo.length;
      this.refreshCountries();
    }
    accion.acuerdosPago = listAcuerdo;
    this.spinner.show();
    this.socioInvitadoService.guardarAccion(this.token, this.numCredito, accion).subscribe(
      res => {
        if (res.exito) {
          this.spinner.hide();
          Swal.fire('Compromiso de Pago', res.mensaje, 'success');
          this.activeModal.close();
        } else {
          Swal.fire('Compromiso de Pago', res.mensaje, 'error');
          this.spinner.hide();
        }
      },
      err => {
        this.spinner.hide();
        Swal.fire('Compromiso de Pago', 'Ocurrio un error', 'error');
      }
    );
  }

  refreshCountries() {
    this.countries = this.$cronograma
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  generarCronograma() {
    let listAcuerdo: AcuerdoPago[] = [];
    if ([1, 3, 4].includes(Number(this.typeAcuerdo))) {
      const acuerdoPago: AcuerdoPago = this.formRegistrarAcuerdo.getRawValue();
      if (acuerdoPago.montoAcordado > 0) {
        acuerdoPago.asignacionId = 0;
        acuerdoPago.creditoId = 0;
        acuerdoPago.ejecutivoId = 0;
        acuerdoPago.socioId = 0;
        acuerdoPago.cuota = 1;
        acuerdoPago.tipoAcuerdo = this.typeAcuerdo;
        acuerdoPago.descripcion = 'estandar';
        listAcuerdo = [acuerdoPago];
        this.$cronograma = listAcuerdo;
        this.collectionSize = listAcuerdo.length;
        this.refreshCountries();
      }
    }

    if (this.typeAcuerdo == 2) {
      const acuerdoPago: AcuerdoPago = this.formPlanPago.getRawValue();
      if (acuerdoPago.montoAcordado > 0 && acuerdoPago.plazo > 0 && acuerdoPago.intervalo > 0) {
        acuerdoPago.asignacionId = 0;
        acuerdoPago.creditoId = 0;
        acuerdoPago.ejecutivoId = 0;
        acuerdoPago.socioId = 0;
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
        this.$cronograma = listAcuerdo;
        this.collectionSize = listAcuerdo.length;
        this.refreshCountries();
      }
    }
  }
}
