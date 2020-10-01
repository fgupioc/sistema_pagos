import {Component, OnInit} from '@angular/core';
import {DndDropEvent, DropEffect} from 'ngx-drag-drop';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {ModalNuevaTareasComponent} from '../modal-nueva-tareas/modal-nueva-tareas.component';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Credito} from '../../../interfaces/credito';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {EjecutivoAsignacion} from '../../../interfaces/ejecutivo-asignacion';
import Swal from 'sweetalert2';

export interface Task {
  nombre: string;
  descripcion: string;
  fechaVencimiento?: string;
  fechaHora?: string;
  disable: boolean;
  handle: boolean;
  proceso?: string;
}

@Component({
  selector: 'app-tarea-detalle',
  templateUrl: './tarea-detalle.component.html',
  styleUrls: ['./tarea-detalle.component.css']
})
export class TareaDetalleComponent implements OnInit {
  tarjeta: EjecutivoAsignacion;
  $tareasLista: Task[] = [
    {
      nombre: 'tarea 1',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad alias iure iusto libero mollitia recusandae rem sint tempora? Atque beatae doloribus illum laborum maiores nihil quasi tenetur, vero voluptas?',
      disable: false,
      handle: false,
      fechaVencimiento: '2020-10-05T08:15:30-05:00',
      fechaHora: '05:00',
      proceso: 'En Lista'

    },

  ];

  $tareasProceso: Task[] = [];
  $tareasTerminadas: Task[] = [];
  private currentDraggableEvent: DragEvent;
  newTask = false;
  nameTask: any;
  $creditos: Credito[] = [];

  constructor(
    private gestionAdministrativaService: GestionAdministrativaService,
    public modalService: NgbModal,
    public config: NgbModalConfig,
    private activeModal: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    activeModal.params.subscribe(({slug}) => {
      if (!slug) {
        router.navigateByUrl('/auth/gestion-administrativa/tareas');
      } else {
        this.loadTableroTareaPorSlug(slug);
      }
    });
  }

  ngOnInit() {

  }

  onDragStart(event: DragEvent) {
    this.currentDraggableEvent = event;

  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent) {
    this.currentDraggableEvent = event;
  }

  onDrop(event: DndDropEvent, process: string, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;
      if (typeof index === 'undefined') {
        index = list.length;
      }
      event.data.proceso = process;
      list.splice(index, 0, event.data);
    }
  }

  nuevaTarea() {
    if (this.nameTask && this.nameTask.trim().length > 0) {
      this.$tareasLista.push({
        nombre: this.nameTask,
        descripcion: '',
        disable: false,
        handle: false,
      });
      this.nameTask = null;
      this.newTask = false;
    }
  }

  showDetail(item: Task) {
    const modal = this.modalService.open(ModalNuevaTareasComponent, {size: 'lg'});
    modal.componentInstance.tarea = item;
    modal.componentInstance.creditos = this.$creditos;
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );

  }

  closeModal(data) {
    console.log(data);
  }

  loadCreditosPorEjecutivo(ejecutivoId: string) {
    this.gestionAdministrativaService.onteberCreditosPorEjecutivo(ejecutivoId).subscribe(
      res => {
        if (res.exito) {
          if (res.objeto) {
            this.$creditos = res.objeto as Credito[];
          }
        } else {
          Swal.fire('Tareas', 'El tablero de tareas no existe', 'error');
          this.router.navigateByUrl('/auth/gestion-administrativa/tareas');
        }
      },
      err => {
        Swal.fire('Tareas', 'El tablero de tareas no existe', 'error');
        this.router.navigateByUrl('/auth/gestion-administrativa/tareas');
      }
    );
  }

  loadTableroTareaPorSlug(slug: string) {
    this.spinner.show();
    this.gestionAdministrativaService.getTableroTareaBySlug(slug).subscribe(
      res => {
        if (res.exito) {
          this.tarjeta = res.objeto as EjecutivoAsignacion;
          this.loadCreditosPorEjecutivo(String(this.tarjeta.ejecutivoId));
        } else {
          Swal.fire('Tareas', res.mensaje, 'warning');
          this.router.navigateByUrl('/auth/gestion-administrativa/tareas');
        }
        this.spinner.hide();
      },
      err => {
        Swal.fire('Tareas', 'El tablero de tareas no existe', 'error');
        this.router.navigateByUrl('/auth/gestion-administrativa/tareas');
        this.spinner.hide();
      }
    );
  }
}
