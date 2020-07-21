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

  constructor(
    config: NgbModalConfig,
    private carteraService: CarteraService,
    private notificacionService: NotificacionService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    public route: ActivatedRoute
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.send = route.snapshot.data.send || false;
  }

  ngOnInit() {
    this.listarCartera();
    this.listarNotificaciones();
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
    this.carteraService.getCarterasActivas().subscribe(
      ({objeto}) => {
        this.carteras = objeto;
        this.spinner.hide();
      }
    );
  }

  cambioCartera() {
    this.spinner.show();
    const codCartera = this.formulario.controls.codCartera.value;
    this.cartera = this.carteras.find(v => v.codCartera == codCartera);
    this.carteraService.getGestiones(codCartera).subscribe(
      response => {
        if (response.exito) {
          this.gestiones = response.objeto;
        }
        this.spinner.hide();
      }
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

  getDias(items: any[]) {
    const dias: any[] = [];
    items.forEach(v => {
      const res = v.dias.split(',');
      res.forEach(c => {
        const item = dias.find(i => i.dia == c);
        if (!item) {
          dias.push({
            dia: Number(c),
            uno: v.codTipoNotificacion == '1' ? v.codTipoNotificacion : null,
            dos: v.codTipoNotificacion == '2' ? v.codTipoNotificacion : null,
            tres: v.codTipoNotificacion == '3' ? v.codTipoNotificacion : null,
            cuatro: v.codTipoNotificacion == '4' ? v.codTipoNotificacion : null,
            cinco: v.codTipoNotificacion == '5' ? v.codTipoNotificacion : null,
            seis: v.codTipoNotificacion == '6' ? v.codTipoNotificacion : null,
            siete: v.codTipoNotificacion == '7' ? v.codTipoNotificacion : null,
          });
        } else {
          item[this.getIndex(v.codTipoNotificacion)] = v.codTipoNotificacion;
        }
      });
    });
    return dias.sort((a, b) => {
      return (a.dia - b.dia);
    });
  }

  getIndex(index) {
    let i;
    switch (index) {
      case 1 :
        i = 'uno';
        break;
      case 2 :
        i = 'dos';
        break;
      case 3 :
        i = 'tres';
        break;
      case 4 :
        i = 'cuatro';
        break;
      case 5 :
        i = 'cinco';
        break;
      case 6 :
        i = 'seis';
        break;
      case 7 :
        i = 'siete';
        break;
    }
    return i;
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
      codGestion: etapa.codGestion,
      codEtapa: etapa.codEtapa,
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
    this.notificacionService.buscarNotificacionEtapa(gestion.codGestion, item.codEtapa, noti, day.dia).subscribe(
      res => {
        const modal = this.modalService.open(CrearEtapaNotificionComponent, {size: 'lg', scrollable: true});
        modal.result.then(
          this.closeModal.bind(this),
          this.closeModal.bind(this)
        );
        console.log(res);
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
}
