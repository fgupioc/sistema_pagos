import { Component, OnInit } from '@angular/core';
import {EjecutivoAsignacion} from '../../../interfaces/ejecutivo-asignacion';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Autorizacion} from '../../../comun/autorzacion';
import {MenuService} from '../../../servicios/sistema/menu.service';

@Component({
  selector: 'app-ejecutivo-tarea',
  templateUrl: './ejecutivo-tarea.component.html',
  styleUrls: ['./ejecutivo-tarea.component.css']
})
export class EjecutivoTareaComponent implements OnInit {
  asignaciones: EjecutivoAsignacion[] = [];
  A = Autorizacion;

  constructor(
    public modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gestionAdministrativaService: GestionAdministrativaService,
    public menuS: MenuService
  ) {
  }

  ngOnInit() {
    this.listarTablero();
  }

  listarTablero() {
    this.spinner.show();
    this.gestionAdministrativaService.listarTableroTareasPorEjecutivo().subscribe(
      res => {
        this.asignaciones = res;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
