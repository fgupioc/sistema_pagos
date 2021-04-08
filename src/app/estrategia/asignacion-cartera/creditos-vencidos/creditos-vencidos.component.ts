import { ToastrService } from 'ngx-toastr';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AsignacionCarteraService } from '../../../servicios/asignacion-cartera.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditoTemp } from 'src/app/interfaces/credito-temp';
import { Solicitud } from '../../../interfaces/recuperacion/solicitud';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { CONST } from '../../../comun/CONST';

@Component({
  selector: 'app-creditos-vencidos',
  templateUrl: './creditos-vencidos.component.html',
  styleUrls: ['./creditos-vencidos.component.css']
})
export class CreditosVencidosComponent implements OnInit {
  asignacionUuid: string;
  ejecutivoUuid: string;
  creditos: CreditoTemp[] = [];
  ejecutivo: any;
  creditosSeleccionados: CreditoTemp[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private asignacionCarteraService: AsignacionCarteraService,
    private extrajuducualService: ExtrajudicialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    const { ejecutivoUuid } = activatedRoute.snapshot.params;
    this.ejecutivoUuid = ejecutivoUuid;
    this.loadCreditos(ejecutivoUuid);
  }

  ngOnInit() {
  }

  loadCreditos(uuid) {
    this.spinner.show();
    this.asignacionCarteraService.creditosVencidosPorEjecutivo(uuid).subscribe(
      res => {
        if (res.exito) {
          this.creditos = res.creditos;
          this.ejecutivo = res.ejecutivo;
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }


}
