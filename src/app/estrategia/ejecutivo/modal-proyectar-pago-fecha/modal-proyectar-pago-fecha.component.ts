import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {EventosService} from '../../../servicios/eventos.service';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {ToastrService} from 'ngx-toastr';
import {MontoProyectado} from '../../../models/monto-proyectado';
import Swal from 'sweetalert2';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-modal-proyectar-pago-fecha',
  templateUrl: './modal-proyectar-pago-fecha.component.html',
  styleUrls: ['./modal-proyectar-pago-fecha.component.css']
})
export class ModalProyectarPagoFechaComponent implements OnInit {

  @Input() nroCredito: string;
  @Input() montoAtrasado = 0.0;
  formGroup: FormGroup;
  cuotas: MontoProyectado[] = [];
  saldoFecha = 0.00;
  montoCuotaProxima = 0.00;
  fechaProximoVencimiento: any;
  $fechaProximoVencimiento: any;

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private tablaMaestraService: MaestroService,
    private eventosService: EventosService,
    private asignacionCarteraService: AsignacionCarteraService,
    public menuS: MenuService,
    public toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      monto: [this.montoAtrasado, [Validators.required]],
      fecha: ['', [Validators.required]],
    });

    if (this.fechaProximoVencimiento) {
      this.$fechaProximoVencimiento = moment(this.fechaProximoVencimiento).format('YYYY-MM-DD');
      this.formGroup.controls.fecha.setValue(this.$fechaProximoVencimiento);
    }
  }

  public get monto(): AbstractControl {
    return this.formGroup.controls.monto;
  }

  public get fecha(): AbstractControl {
    return this.formGroup.controls.fecha;
  }

  calcular() {
    const data = this.formGroup.getRawValue();
    this.spinner.show('loading');
    this.asignacionCarteraService.simulacionPagoCuotas(this.nroCredito, moment(data.fecha).format('DD/MM/YYYY'), data.monto).subscribe(
      res => {
        if (res.length) {
          this.saldoFecha = res[0].saldoFecha;
          this.montoCuotaProxima = res[0].montoCuotaProxima;
          this.cuotas = res;
        }
        this.spinner.hide('loading');
      },
      err => {
        this.spinner.hide('loading');
      }
    );
  }

  selectedItem(index: any) {
    const cuota = this.cuotas[index];
    if (cuota) {
      Swal.fire({
        title: '¿Esta Seguro?',
        text: 'Se proyectará el monto a la fecha selecionada.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Seleccionar!',
        cancelButtonText: 'Cancelar!'
      }).then(({value}) => {
        if (value) {
          this.activeModal.dismiss(new MontoProyectado(cuota));
        }
      });
    }
  }

  verificarFecha() {
    if (this.validarFecha()) {
      Swal.fire('Proyectar Fecha', 'La fecha seleccionada no es válida. La fecha no debe ser mayor a la próxima fecha de vencimiento.', 'warning');
      this.fecha.setValue(this.$fechaProximoVencimiento);
    }
  }

  validarFecha(): boolean {
    const now = moment(this.fecha.value).format('YYYY-MM-DD');
    const old = moment(this.$fechaProximoVencimiento).format('YYYY-MM-DD');
    return moment(now).isAfter(moment(old));
  }
}
