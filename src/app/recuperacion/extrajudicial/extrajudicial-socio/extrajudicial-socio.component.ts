import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ExtrajudicialService} from '../../../servicios/recuperacion/extrajudicial.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from 'src/app/comun/CONST';
import {SolicitudArchivos} from '../../../interfaces/recuperacion/solicitud-archivos';
import {EnvioNotificacion} from "../../../interfaces/envio-notificacion";
import {EventosService} from 'src/app/servicios/eventos.service';
import {CreditoGestion} from "../../../interfaces/credito-gestion";

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
  creditoPrincipal: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  solicitudArchivos: SolicitudArchivos[] = [];
  archivos: any[] = [];
  vehicular: any[] = [];
  inmuebles: any[] = [];
  acciones: any[] = [];

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  $acciones: any[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private extrajudicialService: ExtrajudicialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private eventosService: EventosService
  ) {
    const {solicitudUuid} = activatedRoute.snapshot.params;
    this.solicitudUuid = solicitudUuid;
    this.loadDetalle(solicitudUuid);
    this.listarAcciones(solicitudUuid);
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
          this.creditoPrincipal = res.creditoPrincipal;
          this.buscarPropiedades(this.socio.id);
          this.refreshDatatable();
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  listarAcciones(uuid: string) {
    this.extrajudicialService.obtenerAccionesPorSolicitudUuuid(uuid).subscribe(
      res => {
        if (res.exito) {
          this.acciones = res.acciones;
          this.collectionSize = this.acciones.length;
          this.refreshAcciones();
        }
      }
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
          {type: `${tipo};charset=UTF-8`});
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
          this.router.navigateByUrl('/auth/recuperacion/extrajudicial/solicitudes');
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
          this.router.navigateByUrl('/auth/recuperacion/extrajudicial/solicitudes');
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  buscarPropiedades(socioId: any) {
    this.vehicular = [];
    this.inmuebles = [];
    this.spinner.show();
    this.extrajudicialService.buscarPropiedadesPorSocio(socioId).subscribe(
      res => {
        if (res.exito) {
          this.vehicular = res.vehicular;
          this.inmuebles = res.inmuebles;
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    )
  }

  generarExcelInmueble() {
    this.spinner.show();
    this.extrajudicialService.generarExcelBusquedaPropiedadInmueblePorSocio(this.socio.id).subscribe(
      response => {
        const blob = new Blob([response],
          {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        const objectUrl = (window.URL).createObjectURL(blob);
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, 'lista-inmuebles-' + new Date().getTime() + '.xlsx');
        } else {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          a.download = 'lista-inmuebles-' + new Date().getTime();
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 3000);
        }

        this.spinner.hide();
      },
      err => {
        console.error(err);
        this.spinner.hide();
      }
    );
  }

  generarExcelVehicular() {
    this.spinner.show();
    this.extrajudicialService.generarExcelBusquedaPropiedadVehicularPorSocio(this.socio.id).subscribe(
      response => {
        const blob = new Blob([response],
          {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        const objectUrl = (window.URL).createObjectURL(blob);
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, 'lista-vehicular-' + new Date().getTime() + '.xlsx');
        } else {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          a.download = 'lista-vehicular-' + new Date().getTime();
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 3000);
        }
        this.spinner.hide();
      },
      err => {
        console.error(err);
        this.spinner.hide();
      }
    );
  }

  enviarSMS(data: any) {
    if (data) {
      const {telefono, mensaje} = data;
      const noty: EnvioNotificacion = {
        telefono: telefono,
        mensaje: mensaje,
        codPersona: this.creditoPrincipal.id,
        creditoId: this.creditoPrincipal.socioId,
        asignacionId: this.solicitud.id,
        numeroDia: this.creditoPrincipal.diasAtraso
      }
      this.spinner.show();
      this.extrajudicialService.enviarSMS(noty).subscribe(
        res => {
          if (res.exito) {
            this.toastr.success(res.mensaje);
            this.eventosService.enviarNotifyEmitter.emit({send: true});
            this.listarAcciones(this.solicitudUuid);
          }
          this.spinner.hide();
        },
        err => this.spinner.hide()
      );
    }
  }

  enviarWhatsApp(data: any) {
    if (data) {
      const {telefono, mensaje} = data;
      const noty: EnvioNotificacion = {
        telefono: telefono,
        mensaje: mensaje,
        codPersona: this.creditoPrincipal.id,
        creditoId: this.creditoPrincipal.socioId,
        asignacionId: this.solicitud.id,
        numeroDia: this.creditoPrincipal.diasAtraso
      }

      this.spinner.show();
      this.extrajudicialService.enviarWhatsApp(noty).subscribe(
        res => {
          if (res.exito) {
            this.toastr.success(res.mensaje);
            this.eventosService.enviarNotifyEmitter.emit({send: true});
            this.listarAcciones(this.solicitudUuid);
          }
          this.spinner.hide();
        },
        err => this.spinner.hide()
      );
    }
  }

  enviarCorreo(data: any) {
    if (data) {
      const {asunto, correo, mensaje} = data;
      const noty: EnvioNotificacion = {
        correo: correo,
        mensaje: mensaje,
        asunto: asunto,
        codPersona: this.creditoPrincipal.id,
        creditoId: this.creditoPrincipal.socioId,
        asignacionId: this.solicitud.id,
        numeroDia: this.creditoPrincipal.diasAtraso
      }
      console.log(noty)
      this.spinner.show();
      this.extrajudicialService.enviarCorreo(noty).subscribe(
        res => {
          if (res.exito) {
            this.toastr.success(res.mensaje);
            this.eventosService.enviarNotifyEmitter.emit({send: true});
            this.listarAcciones(this.solicitudUuid);
          }
          this.spinner.hide();
        },
        err => this.spinner.hide()
      );
    }
  }


  showDetalle(i, item: any) {
    console.log(item)
    if ($(`.item_${i}`).hasClass('hidden')) {
      $(`.item-detalle`).addClass('hidden');
      $(`.item_${i}`).removeClass('hidden');
    } else {
      $(`.item-detalle`).addClass('hidden');
    }

    if ($(`.tr_${i}`).hasClass('table-primary')) {
      $(`.tr_${i}`).removeClass('table-primary');
    } else {
      $(`#listaGestiones tbody tr`).removeClass('table-primary');
      $(`.tr_${i}`).addClass('table-primary');
    }

  }

  getComentario(item: any) {
   const texto = item.comentario || '';
   const msj = texto.replace(/<[^>]*>?/g, '');
   return msj.length < 30 ? msj : msj.slice(0, 30) + '...' ;
  }

  refreshAcciones() {
    this.$acciones = this.acciones
      .map((item, i) => ({id: i + 1, ...item}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}
