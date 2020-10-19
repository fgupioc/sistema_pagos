import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {EjecutivoCartera} from '../../../models/ejecutivo-cartera';
import {CONST} from '../../../comun/CONST';
import Swal from 'sweetalert2';
import {ModalAgregarCreditoComponent} from '../modal-agregar-credito/modal-agregar-credito.component';
import {isNullOrUndefined} from 'util';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import * as moment from 'moment';

export interface InfoCampo {
  descripction: string;
}

@Component({
  selector: 'app-ejecutivo-creditos',
  templateUrl: './ejecutivo-creditos.component.html',
  styles: []
})

export class EjecutivoCreditosComponent implements OnInit {
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

    const {role} = activatedRoute.snapshot.data;
    if (role) {
      this.role = role;
      activatedRoute.params.subscribe(({asignacionId}) => {
        if (asignacionId) {
          this.ejecutivoId = auth.loggedUser.id;
          this.asignacionId = asignacionId;
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        }
      });
    } else {
      activatedRoute.params.subscribe(({asignacionId, ejecutivoId}) => {
        if (asignacionId == undefined || ejecutivoId == undefined || asignacionId == 'undefined' || ejecutivoId == 'undefined') {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }
        if (asignacionId && ejecutivoId) {
          this.ejecutivoId = ejecutivoId;
          this.asignacionId = asignacionId;
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + ejecutivoId + '/listado');
        }
      });
    }
  }

  ngOnInit() {
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
        } else {
          if (this.role) {
            this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
          } else {
            this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + this.ejecutivoId + '/listado');
          }
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        if (this.role) {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + this.ejecutivoId + '/listado');
        }
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
   if (this.role) {
     const url = `/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${this.asignacionId}/detalle/${credito.id}/socio`;
     this.router.navigateByUrl(url, {state: {credito}});
   } else {
     const url = `/auth/estrategia/asignacion-cartera/${this.ejecutivoId}/listado/${this.asignacionId}/detalle/${credito.id}/socio`;
     this.router.navigateByUrl(url, {state: {credito}});
   }
  }

  get conPermiso() {
    return moment().isBetween(this.campania.startDate, this.campania.endDate);
  }
}
