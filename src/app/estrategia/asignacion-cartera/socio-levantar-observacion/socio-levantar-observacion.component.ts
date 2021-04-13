import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CONST } from '../../../comun/CONST';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { SocioArchivo } from '../../../interfaces/socio/socio-archivo';
import { FUNC } from '../../../comun/FUNC';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-socio-levantar-observacion',
  templateUrl: './socio-levantar-observacion.component.html',
  styles: []
})
export class SocioLevantarObservacionComponent implements OnInit {
  solicitudUuid: string;
  itemId: string;
  socio: any;
  seccioSeleccionada = '1';
  creditos: any[] = [];
  seguimientos: any[] = [];
  solicitud: any;
  mensaje: string;
  config = CONST.C_CONF_EDITOR;
  fileName: any;
  file: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  archivos: any[] = [];
  progreso = 0;
  ejecutivoUuid: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private extrajudicialService: ExtrajudicialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    const { solicitudUuid, ejecutivoUuid } = activatedRoute.snapshot.params;
    this.solicitudUuid = solicitudUuid;
    this.ejecutivoUuid = ejecutivoUuid;
    this.loadDetalle(solicitudUuid);

  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
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

  aceptar() {

    if (!this.mensaje || (this.mensaje && this.mensaje.trim().length == 0)) {
      this.toastr.warning('Debe ingresar un comentario');
      return;
    }
    this.spinner.show();
    this.extrajudicialService.levantarObservarSolicitudCobranza(this.solicitud.uuid, this.mensaje).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  observar() {

    if (!this.mensaje || (this.mensaje && this.mensaje.trim().length == 0)) {
      this.toastr.warning('Debe ingresar un comentario');
      return;
    }
    this.spinner.show();
    this.extrajudicialService.observarSolicitudExtrajudicial(this.solicitud.uuid, this.mensaje).subscribe(
      res => {
        if (res.exito) {
          this.toastr.success(res.mensaje);
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }


  subirArchivo(labelInput: any) {
    if (this.file) {
      this.extrajudicialService.subirArchivo(this.file, this.solicitud.socioId, this.fileName, FUNC.getFileExtension(this.file.name), this.file.type).subscribe(
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

}
