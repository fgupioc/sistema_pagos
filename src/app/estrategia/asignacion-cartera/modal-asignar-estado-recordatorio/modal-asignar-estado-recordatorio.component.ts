import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {Recordatorio} from '../../../interfaces/recordatorio';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-asignar-estado-recordatorio',
  templateUrl: './modal-asignar-estado-recordatorio.component.html',
  styleUrls: ['./modal-asignar-estado-recordatorio.component.css']
})
export class ModalAsignarEstadoRecordatorioComponent implements OnInit {
  state: any;
  observation: any;
  erros: string[] = [];
  estados: TablaMaestra[] = [];
  recordatorio: Recordatorio;

  constructor(
    public activeModal: NgbActiveModal,
    private asignacionCarteraService: AsignacionCarteraService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.estados = this.estados.filter(item => item.codItem != '1');
    if (!this.recordatorio) {
      this.activeModal.close();
    } else {
      this.state = this.recordatorio.condicion;
      this.observation = this.recordatorio.observacion;
    }
  }

  guardar() {
    if (this.state == 1 || !this.state) {
      this.erros.push('La condicion es obligatoria.');
      return;
    }
    const data = Object.assign({}, this.recordatorio);
    data.condicion = this.state;
    data.observacion = this.observation;
    this.spinner.show();
    this.asignacionCarteraService.actualizarRecordatorio(data).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Recordatorio', res.mensaje, 'success');
          this.activeModal.dismiss(res);
        } else {
          Swal.fire('Recordatorio', res.mensaje, 'error');
        }
        this.spinner.hide();
      }
    );
  }

}
