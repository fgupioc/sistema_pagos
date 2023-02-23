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
        this.spinner.hide('loading');
        this.cuotas = res;
      },
      err => {
        this.spinner.hide('loading');
      }
    );
  }

  selectedItem(cuota: MontoProyectado, index: any) {
    Swal.fire({
      title: '¿Esta Seguro?',
      text: 'Se seleccionó el item número' + index,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Seleccionar!',
      cancelButtonText: 'cancelar!'
    }).then(({value}) => {
      if (value) {
        this.activeModal.dismiss(new MontoProyectado(cuota));
      }
    });
  }
}
