import { Component, OnInit } from '@angular/core';
import { CreditoTemp } from '../../../../interfaces/credito-temp';
import { SocioArchivo } from '../../../../interfaces/socio/socio-archivo';
import { CONST } from '../../../../comun/CONST';
import { TablaMaestra } from '../../../../interfaces/tabla-maestra';
import { Router, ActivatedRoute } from '@angular/router';
import { AsignacionCarteraService } from '../../../../servicios/asignacion-cartera.service';
import { ExtrajudicialService } from '../../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MaestroService } from '../../../../servicios/sistema/maestro.service';
import { FUNC } from '../../../../comun/FUNC';
import { HttpEventType } from '@angular/common/http';
import { Solicitud } from '../../../../interfaces/recuperacion/solicitud';
import { SolicitudArchivos } from 'src/app/interfaces/recuperacion/solicitud-archivos';

@Component({
  selector: 'app-cartera-vencida-socio',
  templateUrl: './cartera-vencida-socio.component.html',
  styleUrls: ['./cartera-vencida-socio.component.css']
})
export class CarteraVencidaSocioComponent implements OnInit {
  asignacionUuid: string;
  ejecutivoUuid: string;
  nroCredito: string;
  credito: CreditoTemp;
  fileName: any;
  file: any;
  //ejecutivo: any;
  progreso = 0;

  archivos: SocioArchivo[] = [];
  mensaje: string;
  config = CONST.C_CONF_EDITOR;

  listaChekList: SolicitudArchivos[] = [];
  $index: string;
  category: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private asignacionCarteraService: AsignacionCarteraService,
    private extrajudicialService: ExtrajudicialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) {
    const { ejecutivoUuid, nroCredito } = activatedRoute.snapshot.params;
    this.ejecutivoUuid = ejecutivoUuid;
    this.nroCredito = nroCredito;
    this.loadCredito(ejecutivoUuid, nroCredito);
  }

  ngOnInit() {
    this.listarArchivosChekList();
  }

  listarArchivosChekList() {
    this.maestroService.listarElementosPorCodTable(CONST.TABLE_STR_LISTA_ARCIVOS_CHEkLIST).subscribe(
      res => {
        this.listaChekList = [];
        const list = res;
        list.forEach(i => {
          this.listaChekList.push({
            codigoArchivo: i.codItem,
            archivoDescripcion: i.descripcion,
            original: false,
            impresion: false,
            laserfich: false,
          })
        });
      }
    )
  }


  loadCredito(ejecutivoUuid, nroCredito) {
    this.spinner.show();
    this.asignacionCarteraService.buscarCreditoVencidosPorEjecutivoUuidAndCredito(ejecutivoUuid, nroCredito).subscribe(
      res => {
        if (res.exito) {
          this.credito = res.credito;
          this.archivos = res.archivos;
          //this.ejecutivo = res.ejecutivo;
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
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
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
      ejecutivoId: this.credito.ejecutivoId,
      solicitudArchivos: this.listaChekList
    }

    this.spinner.show();
    this.extrajudicialService.registrarSolicitud(solicitud).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
          this.router.navigateByUrl(`/auth/procesos/cartera-vencida`);
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

  changeCheck(tipo: any, item: SolicitudArchivos, event: any) {
    item[tipo] = event.target.checked;
  }

  buscarArchivo(event: any, item: SolicitudArchivos, inputFile: HTMLInputElement) {
    if (event.target.files[0]) {
      const value = event.target.value;

      // this will return C:\fakepath\somefile.ext
      console.log(value);

      const files = event.target.files;

      //this will return an ARRAY of File object
      console.log(files);
    }
  }

  mostrarBuscador(imputHtml: HTMLButtonElement) {
    imputHtml.click();
  }

  uploadFile(event: any, item: SolicitudArchivos) {
    if (event.target.files[0]) {
      this.$index = item.codigoArchivo;
      const file = event.target.files[0];
      this.extrajudicialService.subirArchivo(file, this.credito.socioId, item.archivoDescripcion, FUNC.getFileExtension(file.name), file.type).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            const res: any = event.body;
            if (res.archivo) {
              item.urlDisco = res.archivo.path;
              item.tipo = res.archivo.tipo;
              item.extension = res.archivo.extension;
            }

            this.fileName = '';
            this.progreso = 0;
          }
        },
          err => {
            this.progreso = 0;
            this.toastr.error('Ocurrio un error en la carga del archivo.');
          }
      );
    }
  }
}
