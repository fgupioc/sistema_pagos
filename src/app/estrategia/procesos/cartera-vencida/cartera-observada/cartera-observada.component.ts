import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cartera-observada',
  templateUrl: './cartera-observada.component.html',
  styles: []
})
export class CarteraObservadaComponent implements OnInit {
  solicitudUuid: string;
  itemId: string;
  socio: any;
  seccioSeleccionada = '1';
  creditos: any[] = [];
  seguimientos: any[] = [];
  solicitud: any;
  mensaje: string;
  config = CONST.C_CONF_EDITOR;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  $index: string;
  category: any;
  progreso = 0;

  solicitudArchivos: SolicitudArchivos[] = [];
  archivos: any[] = [];
  credito: CreditoTemp;
  listaChekList: SolicitudArchivos[] = [];
  acontecimientos = '';
  comentarios = '';
  temporal: Solicitud;
  nroCredito: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private extrajudicialService: ExtrajudicialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) {
    const { solicitudUuid } = activatedRoute.snapshot.params;
    this.solicitudUuid = solicitudUuid;
    this.loadDetalle(solicitudUuid);
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
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

  loadDetalle(uuid: string) {
    this.spinner.show();
    this.extrajudicialService.buscarDetalleSolicitud(uuid).subscribe(
      res => {
        if (res.exito) {
          this.solicitud = res.solicitud;
          this.socio = res.socio;
          this.creditos = res.creditos;
          this.archivos = res.archivos;
          this.seguimientos = res.seguimientos;
          this.solicitudArchivos = res.solicitudArchivos;
          this.credito = res.creditoPrincipal;
          this.temporal = res.solicitudTemp;
          this.nroCredito = this.credito.nroCredito;
          this.acontecimientos = this.solicitud.acontecimientos;
          this.comentarios = this.solicitud.comentarios;

          if(this.temporal) {
            this.acontecimientos = this.temporal.acontecimientos;
            this.comentarios  =  this.temporal.comentarios;
            this.mensaje = this.temporal.mensaje;
            if (this.temporal.solicitudArchivos) {
              this.solicitudArchivos.forEach(i => {
                const item = this.temporal.solicitudArchivos.find(o => o.codigoArchivo == i.codigoArchivo);
                if (item) {
                  i.comentario = item.comentario;
                  i.extension = item.extension;
                  i.impresion = item.impresion;
                  i.laserfich = item.laserfich;
                  i.original = item.original;
                  i.tipo = item.tipo;
                  i.urlDisco = item.urlDisco;
                  i.urlLaserfich = item.urlLaserfich;
                }
              });
            }
          }

          this.refreshDatatable();
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  tabSeleccionado(event: NgbTabChangeEvent) {
    this.seccioSeleccionada = event.nextId;
  }

  refreshDatatable() {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }


  download(path: string, tipo: string) {
    this.spinner.show();
    this.extrajudicialService.descargarArchivo(path).subscribe(
      response => {
        const blob = new Blob([response],
          { type: `${tipo};charset=UTF-8` });
        const objectUrl = (window.URL).createObjectURL(blob);
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, path);
        } else {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          a.download = path;
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

  aceptar() {
    if (!this.mensaje || (this.mensaje && this.mensaje.trim().length == 0)) {
      this.toastr.warning('Debe ingresar un comentario');
      return;
    }

    const solicitud: Solicitud = {
      uuid: this.solicitud.uuid,
      nroCredito: this.credito.nroCredito,
      socioId: this.credito.socioId,
      codCreditoPrincipal: this.credito.id,
      mensaje: this.mensaje,
      ejecutivoId: this.credito.ejecutivoId,
      solicitudArchivos: this.solicitudArchivos
    }

    this.spinner.show();
    this.extrajudicialService.levantarObservarSolicitudCobranza(solicitud).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
          this.router.navigateByUrl('/auth/procesos/cartera-observada');
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }


  changeCheck(tipo: any, item: SolicitudArchivos, event: any) {
    item.original = false;
    item.impresion = false;
    item.laserfich = false;
    item[tipo] = event.target.checked;
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


  descargarFormato() {
    this.spinner.show();
    const times = new Date().getTime();
    this.extrajudicialService.generarFormatoTransferenciaExtrajudicial(times, this.acontecimientos, this.comentarios, this.nroCredito).subscribe(
      response => {
        const blob = new Blob([response], {type: 'application/pdf;charset=UTF-8'});
        const objectUrl = (window.URL).createObjectURL(blob);
        const nombre = `${this.nroCredito}_documento-transferencia-recuperacion.pdf`;
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, nombre);
        } else {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          a.download = nombre;
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

  guardarTemporal() {
    const solicitud: Solicitud = {
      codCreditoPrincipal: this.credito.id,
      nroCredito: this.credito.nroCredito,
      mensaje: this.mensaje || '',
      solicitudArchivos: this.solicitudArchivos,
      acontecimientos: this.acontecimientos,
      comentarios: this.comentarios
    }

    this.spinner.show();
    this.extrajudicialService.guardarSolicitudTemporal(solicitud).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
