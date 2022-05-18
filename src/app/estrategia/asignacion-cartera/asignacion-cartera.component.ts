import {Component, OnInit} from '@angular/core';
import {AsignacionCarteraService} from '../../servicios/asignacion-cartera.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalBuscarSocioAsignacionComponent} from '../componentes/modals/modal-buscar-socio-asignacion/modal-buscar-socio-asignacion.component';
import {Autorizacion} from '../../comun/autorzacion';
import {MenuService} from '../../servicios/sistema/menu.service';

@Component({
  selector: 'app-asignacion-carter',
  templateUrl: './asignacion-cartera.component.html',
  styles: []
})
export class AsignacionCarteraComponent implements OnInit {
  ejecutivos: any[] = [];
  A = Autorizacion;
  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private modalService: NgbModal,
    public menuS: MenuService
  ) {
  }

  ngOnInit() {
    if (this.menuS.hasShowAsigCartera(this.A.ASI_CAR_GESTORES)) {
      this.listarEjecutivos();
    }
  }


  listarEjecutivos() {
    this.spinner.show();
    this.asignacionService.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  findSocio() {
    this.modalService.open(ModalBuscarSocioAsignacionComponent, {scrollable: true, size: 'lg'});
  }
}
