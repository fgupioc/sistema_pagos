import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalTableroNuevaTareaComponent} from '../modal-tablero-nueva-tarea/modal-tablero-nueva-tarea.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {EjecutivoAsignacion} from '../../../interfaces/ejecutivo-asignacion';
import {Autorizacion} from '../../../comun/autorzacion';
import {MenuService} from '../../../servicios/sistema/menu.service';

@Component({
  selector: 'app-tablero-tareas',
  templateUrl: './tablero-tareas.component.html',
  styleUrls: ['./tablero-tareas.component.css']
})
export class TableroTareasComponent implements OnInit {
  ejecutivos: any[] = [];
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
    this.listarEjecutivos();
  }

  showModalNuevaTarea() {
    const modal = this.modalService.open(ModalTableroNuevaTareaComponent, {centered: true});
    modal.componentInstance.ejecutivos = this.ejecutivos;
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );

  }

  listarTablero() {
    this.spinner.show();
    this.gestionAdministrativaService.listarTableroEjecutivoTareas().subscribe(
      res => {
        this.asignaciones = res;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  listarEjecutivos() {
    this.asignacionService.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  closeModal(data) {
    if (data && data.flag) {
      this.listarTablero();
    }
  }
}
