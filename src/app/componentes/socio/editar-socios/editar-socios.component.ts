import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GestionarDireccionComponent } from '../gestionar-direccion/gestionar-direccion.component';
import { GestionarTelefonoComponent } from '../gestionar-telefono/gestionar-telefono.component';
import { GestionarCorreoComponent } from '../gestionar-correo/gestionar-correo.component';

@Component({
  selector: 'app-editar-socios',
  templateUrl: './editar-socios.component.html',
  styleUrls: ['./editar-socios.component.css']
})
export class EditarSociosComponent implements OnInit {
  socio: any;
  direcciones: any[] = [];
  telefonos: any[] = [];
  correos: any[] = [];

  constructor(
    config: NgbModalConfig,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal
  ) {
    config.backdrop = 'static',
    config.keyboard = false;
   }

  ngOnInit() {
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
  }

  closeModalCorreo() {
  }

}
