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
  ejecutivo: any;
  progreso = 0;

  archivos: SocioArchivo[] = [];
  mensaje: string;
  config = CONST.C_CONF_EDITOR;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private asignacionCarteraService: AsignacionCarteraService,
    private extrajudicialService: ExtrajudicialService,
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
          this.archivos = res.archivos;
          this.ejecutivo = res.ejecutivo;
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  subirArchivo(labelInput: any) {
    if (this.file) {
      this.extrajudicialService.subirArchivo(this.file, this.credito.socioId, this.fileName, FUNC.getFileExtension(this.file.name), this.file.type).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if(event.type === HttpEventType.Response) {
            const res: any = event.body;
            if (res.archivo) {
              this.archivos.push(res.archivo)
            }
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
      ejecutivoId: this.ejecutivo.id
    }

    this.spinner.show();
    this.extrajudicialService.registrarSolicitud(solicitud).subscribe(
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

  download(item: SocioArchivo) {
    this.spinner.show();
    this.extrajudicialService.descargarArchivo(item.path).subscribe(
      response => {
        const blob = new Blob([response],
          { type: `${item.tipo};charset=UTF-8` });
        const objectUrl = (window.URL).createObjectURL(blob);
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, item.path);
        } else {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          a.download = item.path;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 3000);
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
