import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONST } from 'src/app/comun/CONST';
import { SocioArchivo } from '../../../interfaces/socio/socio-archivo';
import { SolicitudArchivos } from '../../../interfaces/recuperacion/solicitud-archivos';

@Component({
  selector: 'app-extrajudicial-socio',
  templateUrl: './extrajudicial-socio.component.html',
  styleUrls: ['./extrajudicial-socio.component.css']
})
export class ExtrajudicialSocioComponent implements OnInit {
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

  solicitudArchivos: SolicitudArchivos[] = [];
  archivos: any[] = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private extrajudicialService: ExtrajudicialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    const { solicitudUuid } = activatedRoute.snapshot.params;
    this.solicitudUuid = solicitudUuid;
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
          this.solicitudArchivos = res.solicitudArchivos;
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
    this.spinner.show();
    this.extrajudicialService.aceptarSolicitudExtrajudicial(this.solicitud.uuid, this.mensaje).subscribe(
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
}
