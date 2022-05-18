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
import {Tarea} from '../../../interfaces/tarea';
import {CONST} from '../../../comun/CONST';
import {FUNC} from '../../../comun/FUNC';
import {EventosService} from '../../../servicios/eventos.service';
import {Autorizacion} from '../../../comun/autorzacion';
import {MenuService} from '../../../servicios/sistema/menu.service';

@Component({
  selector: 'app-tarea-detalle',
  templateUrl: './tarea-detalle.component.html',
  styleUrls: ['./tarea-detalle.component.css']
})
export class TareaDetalleComponent implements OnInit {
  tarjeta: EjecutivoAsignacion;
  $tareasLista: Tarea[] = [];
  $tareasListaTemp: Tarea[] = [];
  $tareasProceso: Tarea[] = [];
  $tareasProcesoTemp: Tarea[] = [];
  $tareasTerminadas: Tarea[] = [];
  $tareasTerminadasTemp: Tarea[] = [];
  private currentDraggableEvent: DragEvent;
  newTask = false;
  taskName: string;
  $creditos: Credito[] = [];
  role: string;
  A = Autorizacion;

  constructor(
    private gestionAdministrativaService: GestionAdministrativaService,
    public modalService: NgbModal,
    public config: NgbModalConfig,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private eventosService: EventosService,
    public menuS: MenuService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    activatedRoute.params.subscribe(({slug}) => {
      if (!slug) {
        router.navigateByUrl('/auth/gestion-administrativa/tareas');
      } else {
        this.loadTableroTareaPorSlug(slug);
      }
    });
    activatedRoute.data.subscribe(({role}) => this.role = role);
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

      if (event.data.etapaActual == '01' && process == '01') {
        this.$tareasLista.splice(index, 0, event.data);
        return;
      }

      if (event.data.etapaActual == '02' && process == '02') {
        this.$tareasProceso.splice(index, 0, event.data);
        return;
      }

      if (event.data.etapaActual == '03' && process == '03') {
        this.$tareasTerminadas.splice(index, 0, event.data);
        return;
      }

      if (event.data.etapaActual == '01' && process == '03') {
        this.$tareasLista.splice(index, 0, event.data);
        Swal.fire('Tarea', 'Debe arrastrar primero a la lista de "En Proceso"', 'warning');
        return;
      }

      if (event.data.etapaActual == '03' && process != '03') {
        this.$tareasTerminadas.splice(index, 0, event.data);
        Swal.fire('Tarea', 'La tarea ya se encuentra terminada.', 'warning');
        return;
      }

      this.spinner.show();
      this.gestionAdministrativaService.actualizarEtapaTarea(event.data.id, process).subscribe(
        res => {
          if (res.exito) {
            event.data.etapaActual = process;
            list.splice(index, 0, event.data);
            this.eventosService.leerNotifyEmitter.emit({tipo: '03', id: event.data.id});
            this.spinner.hide();
          } else {
            this.loadTableroTareaPorSlug(this.tarjeta.slug);
          }
        },
        error => {
          this.spinner.hide();
          this.loadTableroTareaPorSlug(this.tarjeta.slug);
        }
      );
    }
  }

  nuevaTarea() {
    if (this.taskName && this.taskName.trim().length > 0) {
      const tarea = {
        tableroTareaId: this.tarjeta.id,
        etapaActual: CONST.C_STR_ETAPA_EN_LISTA,
        prioridad: 0,
        nombre: this.taskName,
        condicion: '0',
      };
      this.spinner.show();
      this.gestionAdministrativaService.crearTarea(String(this.tarjeta.id), tarea).subscribe(
        res => {
          if (res.exito) {
            this.$tareasLista.push(res.objeto);
            this.eventosService.leerNotifyEmitter.emit({tipo: '04'});
          } else {
            Swal.fire('Crear Tarea', res.mensaje, 'error');
          }
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          Swal.fire('Crear Tarea', 'Ocurrio un error', 'error');
        }
      );
      this.newTask = false;

    }
  }

  showDetail(item: Tarea) {
    const modal = this.modalService.open(ModalNuevaTareasComponent, {size: 'lg'});
    modal.componentInstance.tarea = item;
    // modal.componentInstance.creditos = this.$creditos;
    modal.componentInstance.creditosAll = this.$creditos;
    modal.componentInstance.ejecutivoId = this.tarjeta.ejecutivoId;
    modal.componentInstance.role = this.role;
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );

  }

  closeModal(data) {
    if (data && data.exito) {
      this.loadTableroTareaPorSlug(this.tarjeta.slug);
    }
  }

  loadCreditosPorEjecutivo(ejecutivoId: string) {
    this.gestionAdministrativaService.onteberCreditosDeAsignacionesPorEjecutivo(ejecutivoId).subscribe(
      res => {
        if (res.exito) {
          if (res.objeto) {
            this.$creditos = res.objeto as Credito[];
          }
        } else {
          Swal.fire('Tareas', 'El tablero de tareas no existe', 'error');
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

  loadTableroTareaPorSlug(slug: string) {
    this.spinner.show();
    this.gestionAdministrativaService.getTableroTareaBySlug(slug).subscribe(
      res => {
        if (res.exito) {
          this.tarjeta = res.objeto as EjecutivoAsignacion;
          this.loadCreditosPorEjecutivo(String(this.tarjeta.ejecutivoId));
          if (this.tarjeta.tareas.length > 0) {
            this.$tareasLista = this.tarjeta.tareas.filter(i => i.etapaActual == CONST.C_STR_ETAPA_EN_LISTA);
            this.$tareasListaTemp = this.tarjeta.tareas.filter(i => i.etapaActual == CONST.C_STR_ETAPA_EN_LISTA);
            this.$tareasProceso = this.tarjeta.tareas.filter(i => i.etapaActual == CONST.C_STR_ETAPA_EN_PROCESO);
            this.$tareasProcesoTemp = this.tarjeta.tareas.filter(i => i.etapaActual == CONST.C_STR_ETAPA_EN_PROCESO);
            this.$tareasTerminadas = this.tarjeta.tareas.filter(i => i.etapaActual == CONST.C_STR_ETAPA_TERMINADA);
            this.$tareasTerminadasTemp = this.tarjeta.tareas.filter(i => i.etapaActual == CONST.C_STR_ETAPA_TERMINADA);
          }
        } else {
          Swal.fire('Tareas', res.mensaje, 'warning');
          this.router.navigateByUrl('/auth/gestion-administrativa/tareas');
          this.spinner.hide();
        }
      },
      err => {
        Swal.fire('Tareas', 'El tablero de tareas no existe', 'error');
        this.router.navigateByUrl('/auth/gestion-administrativa/tareas');
        this.spinner.hide();
      }
    );
  }

  getNamePriority(prioridad: any) {
    return FUNC.getNamePriority(prioridad);
  }

  getClassPriority(prioridad: any) {
    return FUNC.getClassPriority(prioridad);
  }

  getCodCredito(creditoId: number) {
    const credito = this.$creditos.find(i => i.id == creditoId);

    return credito ? credito.nroCredito : '';
  }

  changeEnLista(event: any) {
    const value = event.target.value;
    if (value) {
      this.$tareasLista = this.$tareasListaTemp.filter(i => i.creditoId == value);
    } else {
      this.$tareasLista = this.$tareasListaTemp;
    }
  }

  changeProceso(event: any) {
    const value = event.target.value;
    if (value) {
      this.$tareasProceso = this.$tareasProcesoTemp.filter(i => i.creditoId == value);
    } else {
      this.$tareasProceso = this.$tareasProcesoTemp;
    }
  }

  changeTerminado(event: any) {
    const value = event.target.value;
    if (value) {
      this.$tareasTerminadas = this.$tareasTerminadasTemp.filter(i => i.creditoId == value);
    } else {
      this.$tareasTerminadas = this.$tareasTerminadasTemp;
    }
  }
}
