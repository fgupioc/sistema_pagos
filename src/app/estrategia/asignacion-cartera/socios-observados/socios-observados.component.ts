import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CONST } from '../../../comun/CONST';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';

@Component({
  selector: 'app-socios-observados',
  templateUrl: './socios-observados.component.html',
  styles: []
})
export class SociosObservadosComponent implements OnInit {
  solicitudes: any[] = [];
  ejecutivoUuid: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private extrajudicialService: ExtrajudicialService
  ) {
    const { ejecutivoUuid } = activatedRoute.snapshot.params;
    this.ejecutivoUuid = ejecutivoUuid;
  }

  ngOnInit() {
    this.loadSolicitudes();
  }

  loadSolicitudes() {
    this.spinner.show();
    this.extrajudicialService.listarsolicitudes(CONST.C_SOLICITUD_COBRANZA, '', '', '', '', '', '').subscribe(
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
