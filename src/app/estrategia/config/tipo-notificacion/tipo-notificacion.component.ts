import {Component, OnInit} from '@angular/core';
import {TipoNotificacion} from '../../../models/tipo-notificacion';
import {TipoNotificacionService} from '../../../servicios/tipo-notificacion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {Autorizacion} from '../../../comun/autorzacion';
import {AuthorityService} from '../../../servicios/authority.service';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {MantenedorTipoNotificacionComponent} from '../mantenedor-tipo-notificacion/mantenedor-tipo-notificacion.component';

@Component({
  selector: 'app-tipo-notificacion',
  templateUrl: './tipo-notificacion.component.html',
  styleUrls: ['./tipo-notificacion.component.css']
})
export class TipoNotificacionComponent implements OnInit {
  public A = Autorizacion;
  notificaciones: TipoNotificacion[] = [];
  notificacion: TipoNotificacion;

  constructor(
    private tipoNotificacionService: TipoNotificacionService,
    private spinner: NgxSpinnerService,
    public AS: AuthorityService,
    config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    if (this.AS.has(this.A.TIPO_NOTIFICACION_LISTAR)) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.spinner.show();
    this.tipoNotificacionService.getAll().subscribe(
      res => {
        this.notificaciones = res;
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  showModalCreate() {
    const modal = this.modalService.open(MantenedorTipoNotificacionComponent, {centered: true, size: 'sm'});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this),
    );
  }

  closeModal(data) {
    if (data && data.flag) {
      this.loadNotifications();
    }

  }

  actualizarEstado(item: TipoNotificacion, state: number) {
    const estado = state ? 'Activar' : 'Desactivar';
    Swal.fire({
      title: estado + ' Notificación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ' + estado,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.tipoNotificacionService.cambiarEstado(String(item.codTipoNotificacion), String(state)).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Notificación', res.mensaje, 'success');
              this.loadNotifications();
            } else {
              Swal.fire('Notificación', res.mensaje, 'error');
            }
            this.spinner.hide();
          },
          () => this.spinner.hide()
        );
      }
    });
  }

  edit(item: TipoNotificacion) {
    const modal = this.modalService.open(MantenedorTipoNotificacionComponent, {size: 'sm', centered: true});
    modal.componentInstance.notificacion = item;
    modal.componentInstance.create = false;
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this),
    );
  }

}
