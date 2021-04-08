import { ToastrService } from 'ngx-toastr';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AsignacionCarteraService } from '../../../servicios/asignacion-cartera.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditoTemp } from 'src/app/interfaces/credito-temp';
import { Solicitud } from '../../../interfaces/recuperacion/solicitud';
import { SolicitudDetalle } from '../../../interfaces/recuperacion/solicitud-detalle';
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
  mensaje: string;
  creditos: CreditoTemp[] = [];
  ejecutivo: any;
  creditosSeleccionados: CreditoTemp[] = [];
  config = CONST.C_CONF_EDITOR;

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

  seleccionarTodos(event: any) {
    this.creditosSeleccionados = [];
    if (event.target.checked) {
      this.creditosSeleccionados = this.creditos;
    }
  }

  seleccionado(credito: CreditoTemp) {
    return this.creditosSeleccionados.find(i => i.id == credito.id);
  }

  seleccionarCredito(event: any, credito: CreditoTemp) {

    if (event.target.checked) {
      const item = this.creditosSeleccionados.find(i => i.id == credito.id);
      if (!item) {
        this.creditosSeleccionados.push(credito);
      }
    } else {
      this.creditosSeleccionados = this.creditosSeleccionados.filter(i => i.id != credito.id);
    }

    console.log(this.creditosSeleccionados);
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

  enviarSolicitud() {
    if(!this.mensaje) {
      this.toastr.warning('Debe ingresar una observación');
      return;
    }

    const detalles: SolicitudDetalle[] = [];

    this.creditosSeleccionados.forEach( i => {
      detalles.push({
        socioId: i.socioId,
        codCreditoPrincipal: i.id
      });
    });

    const solicitud: Solicitud = {
      mensaje: this.mensaje,
      ejecutivoId: this.ejecutivo.id,
      detalles
    };

    this.spinner.show();
    this.extrajuducualService.registrarSolicitud(solicitud).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
          this.spinner.hide();
        } else {
          this.toastr.warning(res.mensaje);
          this.spinner.hide();
        }
      },
      err => this.spinner.hide()
    );
  }
}
