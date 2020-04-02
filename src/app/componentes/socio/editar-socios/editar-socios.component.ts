import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GestionarDireccionComponent } from '../gestionar-direccion/gestionar-direccion.component';
import { GestionarTelefonoComponent } from '../gestionar-telefono/gestionar-telefono.component';
import { GestionarCorreoComponent } from '../gestionar-correo/gestionar-correo.component';
import { PerosonaService } from '../../../servicios/perosona.service';

@Component({
  selector: 'app-editar-socios',
  templateUrl: './editar-socios.component.html',
  styleUrls: ['./editar-socios.component.css']
})
export class EditarSociosComponent implements OnInit {
  action = '3';
  socio: any;
  direcciones: any[] = [];
  telefonos: any[] = [];
  correos: any[] = [];
  documentosIdentidad: any[] = [];

  formSocio: FormGroup;

  constructor(
    config: NgbModalConfig,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    private perosonaService: PerosonaService,
  ) {
    config.backdrop = 'static',
    config.keyboard = false;
   }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 1);
    this.obtenerInfomacion();
    this.formSocio = this.formBuilder.group({
      codPersona: [],
      primerApellido: [{value: '', disabled: true}],
      segundoApellido: [{value: '', disabled: true}],
      primerNombre: [{value: '', disabled: true}],
      segundoNombre: [{value: '', disabled: true}],
    });
  }
  obtenerInfomacion() {
    this.perosonaService.buscarSocioPorId('3').subscribe(
      response => {
        this.socio = response;
        this.direcciones = this.socio.direcciones;
        this.correos = this.socio.correos;
        this.telefonos = this.socio.telefonos;
        this.documentosIdentidad = this.socio.documentosIdentidad;
        this.formSocio.controls.primerApellido.setValue(this.socio.personaNatural.primerApellido);
        this.formSocio.controls.segundoApellido.setValue(this.socio.personaNatural.segundoApellido);
        this.formSocio.controls.primerNombre.setValue(this.socio.personaNatural.primerNombre);
        this.formSocio.controls.segundoNombre.setValue(this.socio.personaNatural.segundoNombre);
        this.formSocio.controls.segundoNombre.setValue(this.socio.personaNatural.segundoNombre);
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  modalDireccion(accion) {
    const modal = this.modalService.open(GestionarDireccionComponent, {size: 'lg', scrollable: true});
    modal.result.then(
      this.closeModalDireccion.bind(this),
      this.closeModalDireccion.bind(this)
    );
    modal.componentInstance.accion = accion;
  }

  closeModalDireccion() {

  }

  modalTelefono(accion) {
    const modal = this.modalService.open(GestionarTelefonoComponent, {size: 'lg', scrollable: true, centered: true});
    modal.result.then(
      this.closeModalTelefono.bind(this),
      this.closeModalTelefono.bind(this)
    );
    modal.componentInstance.accion = accion;
  }

  closeModalTelefono() {
  }

  modalCorreo(accion) {
    const modal = this.modalService.open(GestionarCorreoComponent, {size: 'lg', scrollable: true, centered: true});
    modal.result.then(
      this.closeModalCorreo.bind(this),
      this.closeModalCorreo.bind(this)
    );
    modal.componentInstance.accion = accion;
    modal.componentInstance.correos = this.correos;
  }

  closeModalCorreo() {
  }

}
