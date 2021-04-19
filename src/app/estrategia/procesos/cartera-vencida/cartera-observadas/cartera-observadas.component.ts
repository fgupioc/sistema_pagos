import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExtrajudicialService } from '../../../../servicios/recuperacion/extrajudicial.service';
import { CONST } from 'src/app/comun/CONST';

@Component({
  selector: 'app-cartera-observadas',
  templateUrl: './cartera-observadas.component.html',
  styleUrls: ['./cartera-observadas.component.css']
})
export class CarteraObservadasComponent implements OnInit {
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
