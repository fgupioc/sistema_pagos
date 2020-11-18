import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {EjecutivoCartera} from '../../../models/ejecutivo-cartera';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {CONST} from '../../../comun/CONST';
import Swal from 'sweetalert2';
import {ModalAgregarCreditoComponent} from '../modal-agregar-credito/modal-agregar-credito.component';
import * as moment from 'moment';
import {InfoCampo} from '../ejecutivo-creditos/ejecutivo-creditos.component';

@Component({
  selector: 'app-supervisor-creditos',
  templateUrl: './supervisor-creditos.component.html',
  styleUrls: ['./supervisor-creditos.component.css']
})
export class SupervisorCreditosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  ejecutivoId: any;
  ejecutivoNombre: string;
  asignacionId: string;
  creditos: any[] = [];
  campania: EjecutivoCartera;
  tipoCreditos: InfoCampo[] = [];
  sedes: InfoCampo[] = [];
  montos: InfoCampo[] = [];
  role: string;

  constructor(
    private auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;

    activatedRoute.params.subscribe(({asignacionId}) => {
      if (asignacionId) {
        this.ejecutivoId = auth.loggedUser.id;
        this.asignacionId = asignacionId;
      } else {
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-asignaciones');
      }
    });
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    if (this.ejecutivoId && this.asignacionId) {
      this.obtenerAsignnacionPorId(this.asignacionId);
    }
  }

  obtenerAsignnacionPorId(asignacionId: any) {
    this.spinner.show();
    this.tipoCreditos = [];
    this.sedes = [];
    this.montos = [];

    this.asignacionCarteraService.obtenerAsignnacionPorId(asignacionId).subscribe(
      res => {
        if (res.exito) {
          this.campania = res.objeto;
          this.creditos = res.objeto.creditosTemp;
          this.ejecutivoNombre = res.ejecutivo.alias || this.ejecutivoId;
          this.campania.campoItems.forEach(item => {
            switch (item.codCampo) {
              case CONST.TABLE_STR_LISTA_PRODUCTO_ABACO:
                this.tipoCreditos.push({
                  descripction: item.nombreCampo,
                });
                break;
              case CONST.TABLE_STR_LISTA_SEDE:
                this.sedes.push({
                  descripction: item.nombreCampo,
                });
                break;
              case CONST.TABLE_INT_MONTO:
                const hasta = item.hasta ? `- Hasta: ${item.hasta}` : '';
                this.montos.push({
                  descripction: `Desde: ${item.desde} ${hasta}`
                });
                break;
            }
          });
          this.refreshDatatable();
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-asignaciones');
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-asignaciones');
      }
    );
  }

  eliminarCredito(credito: any) {
    Swal.fire({
      title: 'Eliminar crédito de la lista?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.asignacionCarteraService.eliminarCredito(credito.id, this.campania.id).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Asignación de Cartera', res.mensaje, 'success');
              this.obtenerAsignnacionPorId(this.campania.id);
            } else {
              Swal.fire('Asignación de Cartera', res.mensaje, 'error');
            }
          },
          err => {
            Swal.fire('Asignación de Cartera', err, 'error');
          }
        );
      }
    });
  }

  agregarCredito() {
    const modal = this.modalService.open(ModalAgregarCreditoComponent, {size: 'xl'});
    modal.result.then(
      this.closeModalAgregarCredito.bind(this),
      this.closeModalAgregarCredito.bind(this)
    );
    modal.componentInstance.data = this.campania;
    modal.componentInstance.creditosAsignacion = this.creditos;
  }

  closeModalAgregarCredito(data: any) {
    if (data && data.exito) {
      this.obtenerAsignnacionPorId(this.asignacionId);
      Swal.fire('Asignación de cartera', data.mensaje, 'success');
    }
  }

  irCliente(credito: any) {
    const url = `/auth/estrategia/asignacion-cartera/mis-asignaciones/${this.asignacionId}/detalle/${credito.id}/socio`;
    this.router.navigateByUrl(url, {state: {credito}});
  }

  get conPermiso() {
    if (this.campania) {
      return moment().isBetween(this.campania.startDate, this.campania.endDate);
    } else {
      return false;
    }
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

}
