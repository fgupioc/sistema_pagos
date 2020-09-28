import {Component, OnInit} from '@angular/core';
import {DndDropEvent, DropEffect} from 'ngx-drag-drop';

export interface Tasks {
  content: string;
  effectAllowed: string;
  disable: boolean;
  handle: boolean;
}

@Component({
  selector: 'app-tarea-detalle',
  templateUrl: './tarea-detalle.component.html',
  styleUrls: ['./tarea-detalle.component.css']
})
export class TareaDetalleComponent implements OnInit {

  $tareasLista: Tasks[] = [
    {
      content: 'tarea 1',
      effectAllowed: 'move',
      disable: false,
      handle: false,
    },
    {
      content: 'tarea 2',
      effectAllowed: 'move',
      disable: false,
      handle: false,
    },
    {
      content: 'tarea 3',
      effectAllowed: 'copyMove',
      disable: false,
      handle: false
    },
    {
      content: 'tarea 4',
      effectAllowed: 'move',
      disable: false,
      handle: true,
    },
    {
      content: 'tarea 5',
      effectAllowed: 'move',
      disable: false,
      handle: false,
    }
  ];

  $tareasProceso: Tasks[] = [];
  $tareasTerminadas: Tasks[] = [];
  private currentDraggableEvent: DragEvent;

  constructor() {
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

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;
      if (typeof index === 'undefined') {
        index = list.length;
      }
      list.splice(index, 0, event.data);
    }
  }
}
