import { Component, OnInit } from '@angular/core';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-extrajudicial-solicitud-cambio-estado',
  templateUrl: './extrajudicial-solicitud-cambio-estado.component.html',
  styleUrls: ['./extrajudicial-solicitud-cambio-estado.component.css']
})
export class ExtrajudicialSolicitudCambioEstadoComponent implements OnInit {
  solicitudes: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private extrajudicialService: ExtrajudicialService
  ) { }

  ngOnInit() {
    this.loadSolicitudes();
  }

  loadSolicitudes() {
    this.spinner.show();
    this.extrajudicialService.listarsolicitudes().subscribe(
      res => {
      if (res.exito) {
        this.solicitudes = res.solicitudes;
      }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }
}
