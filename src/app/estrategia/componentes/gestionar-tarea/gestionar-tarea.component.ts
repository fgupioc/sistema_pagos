import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {Tarea} from '../../../interfaces/tarea';
import {CONST} from '../../../comun/CONST';
import {Credito} from '../../../interfaces/credito';
import {EjecutivoAsignacion} from '../../../interfaces/ejecutivo-asignacion';
import {FUNC} from '../../../comun/FUNC';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {MaestroService} from '../../../servicios/sistema/maestro.service';

@Component({
  selector: 'app-gestionar-tarea',
  templateUrl: './gestionar-tarea.component.html',
  styleUrls: ['./gestionar-tarea.component.css']
})
export class GestionarTareaComponent implements OnInit {
  formTarea: FormGroup;
  @Input() credito: Credito;
  @Input() ejecutivoId: any;
  @Input() misTableros: EjecutivoAsignacion[] = [];
  @Input() showNewTask = false;
  @Input() addTablero = true;
  @Output() tareaEventEmitter = new EventEmitter();
  tipoActividades: TablaMaestra[] = [];
  $horario: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private tablaMaestraService: MaestroService,
  ) {
  }

  ngOnInit() {
    for (let index = 1; index <= 12; index++) {
      if (index < 10) {
        this.$horario.push('0' + index);
      } else {
        this.$horario.push(index);
      }
    }
    this.listarTipoActividades();
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

    if (this.ejecutivoId && this.misTableros.length == 0) {
      this.listarTablero(this.ejecutivoId);
    }
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
          ejecutivoId: this.ejecutivoId,
          visibilidad: '01',
        };
        this.spinner.show();
        this.asignacionCarteraService.crearAsignacionTarea(data).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Crear Nuevo Tablero', res.mensaje, 'success');
              this.listarTablero(this.ejecutivoId);
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


  guardarTarea() {
    if (this.formTarea.invalid) {
      Swal.fire(
        'Crear Tarea',
        'Debe ingresar los campos obligatorios.',
        'warning'
      );
      return;
    }
    const task: any = this.formTarea.getRawValue();
    task.etapaActual = CONST.C_STR_ETAPA_EN_LISTA;
    task.creditoId = this.credito.id;
    task.socioId = this.credito.socioId;
    task.asignacionId = this.credito.asignacionId;
    task.condicion = '0';

    delete task.horaA;
    delete task.horaB;
    delete task.minA;
    delete task.minB;
    delete task.tiempoA;
    delete task.tiempoB;
    this.tareaEventEmitter.emit({task});
  }

  listarTablero(ejecutivoId: any) {
    this.spinner.show('tarea');
    this.asignacionCarteraService.listarTableroTareasPorEjecutivo(ejecutivoId).subscribe(
      res => {
        this.misTableros = res;
        this.spinner.hide('tarea');
      },
      err => {
        this.spinner.hide('tarea');
      }
    );
  }

  cancelar() {
    this.formTarea.reset();
    this.tareaEventEmitter.emit({showNewTask: false});
  }

   listarTipoActividades() {
    this.tablaMaestraService.listarTipoActividades().subscribe(
      res => {
        this.tipoActividades = res;
      }
    );
  }

  cambioFechaVencimient() {
    const hora = Number(moment().format('h'));
    const min = Number(moment().format('mm'));
    const tiempo = moment().format('a');
    const $horaS = hora + 1 < 10 ? '0' + (hora + 1) : String(hora);
    this.formTarea.controls.horaA.setValue($horaS);
    this.formTarea.controls.minA.setValue(min >= 30 ? '30' : '00');
    this.formTarea.controls.tiempoA.setValue(tiempo);
    this.cambioHoraVencimient();
  }

  cambioHoraVencimient() {
    const $hora =
      this.formTarea.controls.tiempoA.value == 'am'
        ? this.formTarea.controls.horaA.value
        : String(Number(this.formTarea.controls.horaA.value) + 12);
    this.formTarea.controls.horaVencimiento.setValue(
      `${$hora}:${this.formTarea.controls.minA.value}`
    );
    if (this.formTarea.controls.checkFechaRecordatorio.value) {
      this.allHoraRecordatorio();
    } else {
      this.formTarea.controls.horaB.setValue('');
      this.formTarea.controls.minB.setValue('');
      this.formTarea.controls.tiempoB.setValue('');
    }
  }

  cambioHoraRecordatorio() {
    const $hora =
      this.formTarea.controls.tiempoB.value == 'am'
        ? this.formTarea.controls.horaB.value
        : String(Number(this.formTarea.controls.horaB.value) + 12);
    this.formTarea.controls.horaRecordatorio.setValue(
      `${$hora}:${this.formTarea.controls.minB.value}`
    );
  }

  changeRecordatorio(event: any) {
    if (event.target.checked) {
      if (
        this.formTarea.controls.fechaVencimiento.value &&
        this.formTarea.controls.horaVencimiento.value
      ) {
        this.formTarea.controls.fechaRecordatorio.setValue(
          this.formTarea.controls.fechaVencimiento.value
        );
        this.formTarea.controls.horaRecordatorio.setValue(this.getTime);
        this.allHoraRecordatorio();
      } else {
        Swal.fire(
          'Tarea',
          'Debe ingresar una fecha de vencimiento y hora de vencimiento',
          'warning'
        );
        this.formTarea.controls.checkFechaRecordatorio.setValue(false);
        return;
      }
    } else {
      this.formTarea.controls.fechaRecordatorio.setValue(null);
      this.formTarea.controls.horaRecordatorio.setValue(null);
      this.formTarea.controls.horaB.setValue('');
      this.formTarea.controls.minB.setValue('');
      this.formTarea.controls.tiempoB.setValue('');
      this.formTarea.controls.notificacion.setValue(false);
      this.formTarea.controls.correo.setValue(false);
    }
  }

  allHoraRecordatorio() {
    const $time = this.getTime.split(':');
    this.formTarea.controls.horaB.setValue(
      Number($time[0]) > 12
        ? Number($time[0]) - 12 < 10
        ? '0' + (Number($time[0]) - 12)
        : String(Number($time[0]) - 12)
        : $time[0]
    );
    this.formTarea.controls.minB.setValue(
      this.formTarea.controls.minA.value == '00' ? '30' : '00'
    );
    if (Number($time[0]) > 12) {
      this.formTarea.controls.tiempoB.setValue('pm');
    } else {
      this.formTarea.controls.tiempoB.setValue('am');
    }
  }

  chengeFehcaRecordatorio(event: any) {
    if (
      moment(this.formTarea.controls.fechaVencimiento.value).isBefore(event)
    ) {
      this.formTarea.controls.fechaRecordatorio.setValue(
        this.formTarea.controls.fechaVencimiento.value
      );
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
      const time =
        Number(this.formTarea.controls.horaVencimiento.value.slice(0, 2)) - 1;
      return time < 10 ? `0${time}:00` : `${time}:00`;
    } else {
      return '09:00';
    }
  }

}
