import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {EjecutivoCartera} from '../../../models/ejecutivo-cartera';
import {CONST} from '../../../comun/CONST';
import Swal from 'sweetalert2';
import {ModalAgregarCreditoComponent} from '../modal-agregar-credito/modal-agregar-credito.component';

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

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;

    activatedRoute.params.subscribe(({asignacionId, ejecutivoId}) => {
      if (ejecutivoId && asignacionId) {
        this.ejecutivoId = ejecutivoId;
        this.asignacionId = asignacionId;
      } else {
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + ejecutivoId + '/listado');
      }
    });
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
          this.creditos = res.objeto.creditosAsignados;
          this.ejecutivoNombre = res.ejecutivo.alias || this.ejecutivoId;
          this.campania.campoItems.forEach(item => {
            switch (item.codCampo) {
              case CONST.TABLE_INT_LISTA_TIPO_CREDITO:
                this.tipoCreditos.push({
                  descripction: item.nombreCampo,
                });
                break;
              case CONST.TABLE_INT_LISTA_SEDE:
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
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  /*
  showSocio(credito: any) {
    const url = '/auth/estrategia/carteras/' + this.cartera.nombreExterno + '/asignacion/' + this.ejecutivo.codUsuario + '/creditos/socio';
    this.router.navigateByUrl(url, {state: {user: this.ejecutivo, cartera: this.cartera, credito}});
  }
*/
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
}
