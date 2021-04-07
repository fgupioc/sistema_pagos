import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SolicitudDetalle } from '../../../interfaces/recuperacion/solicitud-detalle';

@Component({
  selector: 'app-extrajudicial-socios',
  templateUrl: './extrajudicial-socios.component.html',
  styleUrls: ['./extrajudicial-socios.component.css']
})
export class ExtrajudicialSociosComponent implements OnInit {
  solicitudUuid: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  socios: SolicitudDetalle[] = [];
  sociosSeleccionados: any[] = [];
  mensaje: string;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private extrajudicialService: ExtrajudicialService
  ) {
    const {solicitudUuid} = activatedRoute.snapshot.params;
    this.solicitudUuid = solicitudUuid;
    this.loadDetalle(solicitudUuid);

  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
  }

  estaActivo(codEstado: string) {
    return codEstado === CONST.S_ESTADO_REG_ACTIVO;
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


  loadDetalle(uuid: string) {
    this.spinner.show();
    this.extrajudicialService.buscarDetalleSolicitud(uuid).subscribe(
      res =>{
       if(res.exito) {
         this.socios = res.detalle;
         this.refreshDatatable();
       }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  irLink(item: any) {
    this.router.navigateByUrl('/auth/recuperacion/extrajudicial/solicitudes/' + this.solicitudUuid + '/socios/creditos', { state: { itemId: item.id}});
  }

  seleccionarTodos(event: any) {
    this.sociosSeleccionados = [];
    if (event.target.checked) {
      this.sociosSeleccionados = this.socios;
    }
  }

  seleccionado(socio: any) {
    return this.sociosSeleccionados.find(i => i.id == socio.id);
  }

  seleccionarSocio(event: any, socio: any) {

    if (event.target.checked) {
      const item = this.sociosSeleccionados.find(i => i.id == socio.id);
      if (!item) {
        this.sociosSeleccionados.push(socio);
      }
    } else {
      this.sociosSeleccionados = this.sociosSeleccionados.filter(i => i.id != socio.id);
    }

    console.log(this.sociosSeleccionados);
  }

  enviarSolicitud() {

  }
}
