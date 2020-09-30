import {Component, OnInit} from '@angular/core';
import {DndDropEvent, DropEffect} from 'ngx-drag-drop';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {ModalNuevaTareasComponent} from '../modal-nueva-tareas/modal-nueva-tareas.component';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Credito} from '../../../interfaces/credito';

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
    public config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.loadCreditosPorEjecutivo('54');
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

  private loadCreditosPorEjecutivo(ejecutivoId: string) {
    this.gestionAdministrativaService.onteberCreditosPorEjecutivo(ejecutivoId).subscribe(
      res => {
        if (res.exito) {
          this.$creditos = res.objeto as Credito[];
        }
      }
    );
  }
}
