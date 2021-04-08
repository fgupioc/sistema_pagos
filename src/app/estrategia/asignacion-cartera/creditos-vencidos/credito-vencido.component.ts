import { ExtrajudicialService } from './../../../servicios/recuperacion/extrajudicial.service';
import { CONST } from './../../../comun/CONST';
import { FUNC } from './../../../comun/FUNC';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionCarteraService } from '../../../servicios/asignacion-cartera.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditoTemp } from '../../../interfaces/credito-temp';
import { SocioArchivo } from 'src/app/interfaces/socio/socio-archivo';
import { Solicitud } from '../../../interfaces/recuperacion/solicitud';
import { ToastrService } from 'ngx-toastr';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-credito-vencido',
  templateUrl: './credito-vencido.component.html',
  styleUrls: ['./creditos-vencidos.component.css']
})
export class CreditoVencidoComponent implements OnInit {
  asignacionUuid: string;
  ejecutivoUuid: string;
  nroCredito: string;
  credito: CreditoTemp;
  fileName: any;
  file: any;

  progreso = 0;

  archivos: SocioArchivo[] = [
    { id: 1, nombre: 'Solicitud', fechaRegistro: new Date() },
    { id: 2, nombre: 'Contrato', fechaRegistro: new Date() },
    { id: 3, nombre: 'Pagares y garantias', fechaRegistro: new Date() },
    { id: 4, nombre: 'Cronograma', fechaRegistro: new Date() },
  ];
  mensaje: string;
  config = CONST.C_CONF_EDITOR;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private asignacionCarteraService: AsignacionCarteraService,
    private extrajuducualService: ExtrajudicialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    const { ejecutivoUuid, nroCredito } = activatedRoute.snapshot.params;
    this.ejecutivoUuid = ejecutivoUuid;
    this.nroCredito = nroCredito;
    this.loadCredito(ejecutivoUuid, nroCredito);
  }

  ngOnInit() {
  }

  loadCredito(ejecutivoUuid, nroCredito) {
    this.spinner.show();
    this.asignacionCarteraService.buscarCreditoVencidosPorEjecutivo(ejecutivoUuid, nroCredito).subscribe(
      res => {
        if (res.exito) {
          this.credito = res.credito;
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  subirArchivo(labelInput: any) {
    if (this.file) {
      /*
      this.archivos.push({
        id: this.archivos.length + 1,
        nombre: this.fileName ? (this.fileName.trim().length > 0 ? this.fileName : this.file.name ) : this.file.name,
        fechaRegistro: new Date(),
        extencion: FUNC.getFileExtension(this.file.name)
      });
      */

      this.extrajuducualService.subirArchivo(this.file, this.credito.socioId, this.fileName, FUNC.getFileExtension(this.file.name)).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if(event.type === HttpEventType.Response) {
            const res: any = event.body;
            console.log(res);
            document.getElementById(labelInput.id).innerHTML = 'Buscar archivo';
            this.fileName = '';
            this.progreso = 0;
          }
        }
      );
    }
  }

  changeArchivo(event: any, labelInput: any) {
    if (event.target.files[0]) {
      this.file = event.target.files[0];
      document.getElementById(labelInput.id).innerHTML = event.target.files[0].name;
    }
  }

  enviarSolicitud() {
    if (!this.mensaje) {
      this.toastr.warning('Debe ingresar una observación');
      return;
    }

    const solicitud: Solicitud = {
      socioId: this.credito.socioId,
      codCreditoPrincipal: this.credito.id,
      mensaje: this.mensaje,
      ejecutivoId: this.credito.id,
    }


    console.log(solicitud);
    this.spinner.show();
    this.extrajuducualService.registrarSolicitud(solicitud).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
          this.router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${this.ejecutivoUuid}/creditos-vencidos`);
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
