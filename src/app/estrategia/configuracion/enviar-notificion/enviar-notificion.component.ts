import {Component, OnInit} from '@angular/core';
import {NgbModalConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {NotificacionService} from '../../../servicios/estrategia/notificacion.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {CrearEtapaNotificionComponent} from '../crear-etapa-notificion/crear-etapa-notificion.component';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute, Router} from '@angular/router';
import {Cartera} from '../../../interfaces/cartera';
import {Autorizacion} from '../../../comun/autorzacion';
import {AuthorityService} from '../../../servicios/authority.service';
import {MenuService} from '../../../servicios/sistema/menu.service';

declare var $: any;

@Component({
  selector: 'app-enviar-notificion',
  templateUrl: './enviar-notificion.component.html',
  styleUrls: ['./enviar-notificion.component.css']
})
export class EnviarNotificionComponent implements OnInit {
  send = false;
  cartera: Cartera;
  formulario: FormGroup;
  carteras: Cartera[] = [];
  gestiones: any[] = [];
  etapas: any[] = [];
  notificaciones: any[] = [];
  etapaDias: any[] = [];
  rangos: any[] = [];
  public A = Autorizacion;

  constructor(
    config: NgbModalConfig,
    private carteraService: CarteraService,
    private notificacionService: NotificacionService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    public route: ActivatedRoute,
    public menuS: MenuService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.send = route.snapshot.data.send || false;
  }

  ngOnInit() {
    if (this.menuS.hasShowNotificacion(this.A.NOTIFICACION_SHOW)) {
      this.listarCartera();
      this.listarNotificaciones();
    }

    this.formulario = this.formBuilder.group({
      codCartera: ['', Validators.required]
    });
  }

  listarNotificaciones() {
    this.notificacionService.listar().subscribe(
      response => {
        this.notificaciones = response;
      }
    );
  }

  listarCartera() {
    this.spinner.show();
    this.carteraService.obtenerCarterasActivas().subscribe(
      ({objeto}) => {
        this.carteras = objeto;
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  cambioCartera() {
    this.spinner.show();
    const codCartera = this.formulario.controls.codCartera.value;
    this.cartera = this.carteras.find(v => v.codCartera == codCartera);
    this.carteraService.getGestionesPorCartera(codCartera).subscribe(
      response => {
        if (response.exito) {
          this.gestiones = response.objeto;
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  showDetalle(i) {
    if ($(`.item_${i}`).hasClass('hidden')) {
      $(`.item-detalle`).addClass('hidden');
      $(`.item_${i}`).removeClass('hidden');

      $(`.detail-icon i`).removeClass('fa-minus');
      $(`.detail-icon i`).addClass('fa-plus');
      $(`.btnShow_${i} i`).removeClass('fa-plus');
      $(`.btnShow_${i} i`).addClass('fa-minus');
    } else {
      $(`.item-detalle`).addClass('hidden');
      $(`.btnShow_${i} i`).removeClass('fa-minus');
      $(`.detail-icon i`).addClass('fa-plus');
    }
    $(`.item-etapa-detalle`).addClass('hidden');
    $(`.detail-etapa-icon i`).removeClass('fa-minus');
    $(`.detail-etapa-icon i`).addClass('fa-plus');
  }

  showEtapaDetalle(i) {
    if ($(`.itemEtapa_${i}`).hasClass('hidden')) {
      $(`.item-etapa-detalle`).addClass('hidden');
      $(`.itemEtapa_${i}`).removeClass('hidden');

      $(`.detail-etapa-icon i`).removeClass('fa-minus');
      $(`.detail-etapa-icon i`).addClass('fa-plus');
      $(`.btnShowEtapa_${i} i`).removeClass('fa-plus');
      $(`.btnShowEtapa_${i} i`).addClass('fa-minus');
    } else {
      $(`.item-etapa-detalle`).addClass('hidden');
      $(`.btnShowEtapa_${i} i`).removeClass('fa-minus');
      $(`.detail-etapa-icon i`).addClass('fa-plus');
    }
  }

  getDias(item: any) {
    const dias: any[] = [];
    let c = 1;
    for (let i = item.desde; i <= item.hasta; i++) {
      dias.push(c++);
    }
    return dias.sort((a, b) => (a - b));
  }

  nuevoMensaje(etapa) {
    const modal = this.modalService.open(CrearEtapaNotificionComponent, {size: 'lg', scrollable: true});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    this.generarRango(etapa);
    modal.componentInstance.notificaciones = this.notificaciones;
    modal.componentInstance.obj = {
      codCartera: this.formulario.controls.codCartera.value,
      codGestion: etapa.codCarGestion,
      codCarEtapa: etapa.id,
    };
    modal.componentInstance.rangos = this.rangos;
    modal.componentInstance.send = this.send;
    modal.componentInstance.cartera = this.cartera;
  }

  closeModal(data) {
    if (!isNullOrUndefined(data)) {
      this.cambioCartera();
    }
  }

  generarRango(etapa) {
    this.rangos = [];
    let c = 0;
    for (let i = etapa.desde; i <= etapa.hasta; i++) {
      c++;
      this.rangos.push(c);
    }
  }

  generateRange(etapa) {
    const rangos = [];
    let c = 0;
    for (let i = etapa.desde; i <= etapa.hasta; i++) {
      c++;
      rangos.push(c);
    }
    return rangos;
  }

  showMensaje(gestion, item, noti, day) {
    this.spinner.show();
    this.notificacionService.buscarNotificacionEtapa(gestion.id, item.id, noti, day).subscribe(
      res => {
        const modal = this.modalService.open(CrearEtapaNotificionComponent, {size: 'lg', scrollable: true});
        modal.result.then(
          this.closeModal.bind(this),
          this.closeModal.bind(this)
        );
        modal.componentInstance.notificaciones = this.notificaciones;
        modal.componentInstance.obj = res;
        modal.componentInstance.create = false;
        modal.componentInstance.rangos = this.generateRange(item);
        modal.componentInstance.send = this.send;
        modal.componentInstance.cartera = this.cartera;
        modal.componentInstance.day = day;
        this.spinner.hide();
      }
    );
  }

  showNotify(item: any, day: any, noty: any) {
    if (item.codTipoNotificacion == noty.codTipoNotificacion) {
      const days = item.dias.split(',').map(x => Number(x));
      return days.includes(day);
    }
    return false;
  }

  showRow(item: any, day: any) {
    let flag = false;
    item.notificacionEtapas.forEach(v => {
      const days = v.dias.split(',').map(x => Number(x));
      if (days.includes(day) && item.id == v.codCarEtapa) {
        flag = true;
      }
    });
    return flag;
  }

  getTitleNotify(etapa: any, notify: any): string {
    const item = etapa.notificacionEtapas.find(i => i.codTipoNotificacion == notify.codTipoNotificacion);
    return item ? item.nombre : '';
  }
}
