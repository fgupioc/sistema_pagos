import {Component, NgZone, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SocioInvitadoService} from '../../../../servicios/socio/socio-invitado.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {CreditoGestion} from '../../../../interfaces/credito-gestion';
import {AcuerdoPago} from '../../../../interfaces/acuerdo-pago';

@Component({
  selector: 'app-llamenme',
  templateUrl: './llamenme.component.html',
  styleUrls: ['./llamenme.component.css']
})
export class LlamenmeComponent implements OnInit {
  comment = '';
  info: any;
  token: string;
  numCredito: string;
  fecha: any;
  hora: any;

  constructor(
    public activeModal: NgbActiveModal,
    private socioInvitadoService: SocioInvitadoService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
  }


  enviar() {
    if (this.comment.trim().length == 0 || this.comment.trim().length > 225) {
      Swal.fire('Informe que Pagué', 'Debe ingresar un comentario', 'warning');
      return;
    }

    const accion: CreditoGestion = {
      tipoGestion: '001',
      tipoContacto: '5',
      target: 'Quiero que me Llamen',
      codRespuesta: '006',
      comentario: this.comment + ' | el día: ' + this.fecha + ' ' + this.hora,
      duracion: 0,
      usuarioId: 0,
      ejecutivoNombre: '',
      gestionDescripcion: '',
      contactoDescripcion: '',
      respuestaDescripcion: '',
      creditoId: 0,
      asignacionId: 0,
    };
    accion.acuerdosPago = [];
    this.spinner.show();
    this.socioInvitadoService.guardarAccion(this.token, this.numCredito, accion).subscribe(
      res => {
        if (res.exito) {
          this.spinner.hide();
          Swal.fire('Agendar Llamada', res.mensaje, 'success');
          this.activeModal.close();
        } else {
          Swal.fire('Agendar Llamada', res.mensaje, 'error');
          this.spinner.hide();
        }
      },
      err => {
        this.spinner.hide();
        Swal.fire('Agendar Llamada', 'Ocurrio un error', 'error');
      }
    );
  }


}
