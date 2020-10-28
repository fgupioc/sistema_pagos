import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SocioInvitadoService} from '../../../../servicios/socio/socio-invitado.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {CreditoGestion} from '../../../../interfaces/credito-gestion';
import {AcuerdoPago} from '../../../../interfaces/acuerdo-pago';

@Component({
  selector: 'app-ya-pague',
  templateUrl: './ya-pague.component.html',
  styleUrls: ['./ya-pague.component.css']
})
export class YaPagueComponent implements OnInit {
  comment = '';
  info: any;
  token: string;
  numCredito: string;

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
      target: 'Informar que Pagué',
      codRespuesta: '010',
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
    const listAcuerdo: AcuerdoPago[] = [];
    accion.acuerdosPago = listAcuerdo;
    this.spinner.show();
    this.socioInvitadoService.guardarAccion(this.token, this.numCredito, accion).subscribe(
      res => {
        if (res.exito) {
          this.spinner.hide();
          Swal.fire('Informe que Pagué', res.mensaje, 'success');
          this.activeModal.close();
        } else {
          Swal.fire('Informe que Pagué', res.mensaje, 'error');
          this.spinner.hide();
        }
      },
      err => {
        this.spinner.hide();
        Swal.fire('Informe que Pagué', 'Ocurrio un error', 'error');
      }
    );
  }
}
