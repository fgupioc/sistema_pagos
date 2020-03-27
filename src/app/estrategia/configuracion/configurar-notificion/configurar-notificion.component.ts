import { Component, OnInit } from '@angular/core'; 
import { NotificacionService } from '../../../servicios/estrategia/notificacion.service';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-configurar-notificion',
  templateUrl: './configurar-notificion.component.html',
  styleUrls: ['./configurar-notificion.component.css']
})
export class ConfigurarNotificionComponent implements OnInit {
  formulario: FormGroup;

  carteras: any[] = [];
  gestiones: any[] = [];
  etapas: any[] = [];
  notificaciones: any[] = [];

  constructor(
    private carteraService: CarteraService,
    private notificacionService: NotificacionService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.listarCartera();
    this.listarNotificaciones();
    this.formulario = this.formBuilder.group({
      codCartera: ['', Validators.required],
      codGestion: ['', Validators.required],
      codEtapa: ['', Validators.required],
      codNotificacion: ['', Validators.required],
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
          console.log(response.objeto);
        }
        this.spinner.hide();
      }
    );
  }

  cambioGestion() {
    const codGestion = this.formulario.controls.codGestion.value;
    const gestion = this.gestiones.find(v => v.codGestion == codGestion);
    this.etapas = gestion.etapas ? gestion.etapas : [];
  }
}
