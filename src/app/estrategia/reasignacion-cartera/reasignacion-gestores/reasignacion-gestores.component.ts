import { Component, OnInit } from '@angular/core';
import {Autorizacion} from '../../../comun/autorzacion';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MenuService} from '../../../servicios/sistema/menu.service';

@Component({
  selector: 'app-reasignacion-gestores',
  templateUrl: './reasignacion-gestores.component.html',
  styleUrls: ['./reasignacion-gestores.component.css']
})
export class ReasignacionGestoresComponent implements OnInit {

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
}
