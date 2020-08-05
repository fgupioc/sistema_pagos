import {Component, OnInit} from '@angular/core';
import {NotificacionService} from '../../../servicios/estrategia/notificacion.service';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {CrearEtapaNotificionComponent} from '../crear-etapa-notificion/crear-etapa-notificion.component';
import {isNullOrUndefined} from 'util';
import {Cartera} from '../../../interfaces/cartera';
import {Autorizacion} from '../../../comun/autorzacion';
import {AuthorityService} from '../../../servicios/authority.service';

@Component({
  selector: 'app-configurar-notificion',
  templateUrl: './configurar-notificion.component.html',
  styleUrls: ['./configurar-notificion.component.css']
})
export class ConfigurarNotificionComponent implements OnInit {
  public A = Autorizacion;
  formulario: FormGroup;
  cartera: Cartera;
  carteras: any[] = [];
  gestiones: any[] = [];
  etapas: any[] = [];
  notificaciones: any[] = [];
  mensajes: any[] = [];
  rangos: any[] = [];

  constructor(
    config: NgbModalConfig,
    private carteraService: CarteraService,
    private notificacionService: NotificacionService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    public AS: AuthorityService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.listarCartera();
    this.listarNotificaciones();
    this.formulario = this.formBuilder.group({
      codCartera: ['', Validators.required],
      codGestion: ['', Validators.required],
      codEtapa: ['', Validators.required]
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
      response => {
        this.carteras = response.objeto;
        this.spinner.hide();
      }
    );
  }

  cambioCartera() {
    this.mensajes = [];
    this.formulario.controls.codEtapa.setValue('');
    this.formulario.controls.codGestion.setValue('');
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

  cambioGestion() {
    this.mensajes = [];
    const codGestion = this.formulario.controls.codGestion.value;
    const gestion = this.gestiones.find(v => v.codGestion == codGestion);
    if (gestion) {
      this.etapas = gestion.etapas ? gestion.etapas : [];
    }
    this.formulario.controls.codEtapa.setValue('');
  }

  cambioEtapa() {
    this.spinner.show();
    this.mensajes = [];
    const codEtapa = this.formulario.controls.codEtapa.value;
    this.notificacionService.getNotificacionesPorEtapa(codEtapa).subscribe(
      response => {
        this.mensajes = response;
        this.spinner.hide();
      }
    );

    this.generarRango();
  }

  getNameTypeNotifi(code: any) {
    const noti = this.notificaciones.find(v => v.codTipoNotificacion == code);
    return noti ? noti.nombre : '';
  }

  nuevaNotificacion() {
    const modal = this.modalService.open(CrearEtapaNotificionComponent, {size: 'lg', scrollable: true});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    modal.componentInstance.cartera = this.cartera;
    modal.componentInstance.notificaciones = this.notificaciones;
    modal.componentInstance.obj = this.formulario.getRawValue();
    modal.componentInstance.rangos = this.rangos;
    modal.componentInstance.send = false;
  }

  actualizarNotificacion(item) {
    const modal = this.modalService.open(CrearEtapaNotificionComponent, {size: 'lg', scrollable: true});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    modal.componentInstance.cartera = this.cartera;
    modal.componentInstance.notificaciones = this.notificaciones;
    modal.componentInstance.obj = item;
    modal.componentInstance.create = false;
    modal.componentInstance.rangos = this.rangos;
    modal.componentInstance.send = false;
  }

  closeModal(data) {
    if (!isNullOrUndefined(data)) {
      this.cambioEtapa();
    }
  }

  generarRango() {
    this.rangos = [];
    const codEtapa = this.formulario.controls.codEtapa.value;
    const etapaSelect: any = this.etapas.find(i => i.codEtapa == codEtapa);
    if (etapaSelect) {
      let c = 0;
      for (let i = etapaSelect.desde; i <= etapaSelect.hasta; i++) {
        c++;
        this.rangos.push(c);
      }
    }
  }
}
