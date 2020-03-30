import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { NotificacionService } from '../../../servicios/estrategia/notificacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-enviar-notificion',
  templateUrl: './enviar-notificion.component.html',
  styleUrls: ['./enviar-notificion.component.css']
})
export class EnviarNotificionComponent implements OnInit {
  formulario: FormGroup;
  carteras: any[] = [];
  gestiones: any[] = [];
  etapas: any[] = [];
  notificaciones: any[] = [];
  etapaDias: any[] = [];

  constructor(
    config: NgbModalConfig,
    private carteraService: CarteraService,
    private notificacionService: NotificacionService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.listarCartera();
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
    this.carteraService.activas().subscribe(
      response => {
        this.carteras = response;
        this.spinner.hide();
      }
    );
  }

  cambioCartera() {
    this.spinner.show();
    const codCartera = this.formulario.controls.codCartera.value;
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
    return dias.sort( (a, b) => {
      return (a.dia - b.dia)
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
}
