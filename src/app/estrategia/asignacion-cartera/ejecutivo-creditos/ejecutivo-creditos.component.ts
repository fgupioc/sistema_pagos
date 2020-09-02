import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {EjecutivoCartera} from '../../../models/ejecutivo-cartera';
import {CONST} from '../../../comun/CONST';

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
  asignacionId: string;
  creditos: any[] = [];
  campania: EjecutivoCartera;
  tipoCreditos: InfoCampo[] = [];
  sedes: InfoCampo[] = [];
  montos: InfoCampo[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private asignacion: AsignacionCarteraService,
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
    this.asignacion.obtenerAsignnacionPorId(asignacionId).subscribe(
      res => {
        if (res.exito) {
          this.campania = res.objeto;
          this.creditos = res.objeto.creditosAsignados;
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
}
