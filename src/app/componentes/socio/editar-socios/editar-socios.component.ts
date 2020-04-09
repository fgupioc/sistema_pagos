import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GestionarDireccionComponent } from '../gestionar-direccion/gestionar-direccion.component';
import { GestionarTelefonoComponent } from '../gestionar-telefono/gestionar-telefono.component';
import { GestionarCorreoComponent } from '../gestionar-correo/gestionar-correo.component';
import { PersonaService } from '../../../servicios/persona.service';
import { MaestroService } from '../../../servicios/sistema/maestro.service';

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
  tipoUsos: any[] = [];
  formSocio: FormGroup;
  tipoOperadores: any[] = [];
  tipoDirecciones: any[] = [];
  tipoDocumentos: any[] = [];

  constructor(
    config: NgbModalConfig,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    private perosonaService: PersonaService,
    private maestroService: MaestroService
  ) {
    config.backdrop = 'static',
    config.keyboard = false;
   }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 1);
    this.listarTipoUso();
    this.listarTipoOperador();
    this.listarTipoDirecciones();
    this.listarTipoDocumentos();
    this.obtenerInfomacion();
    this.formSocio = this.formBuilder.group({
      codPersona: [],
      primerApellido: [{value: '', disabled: true}],
      segundoApellido: [{value: '', disabled: true}],
      primerNombre: [{value: '', disabled: true}],
      segundoNombre: [{value: '', disabled: true}],
    });
  }

  listarTipoDocumentos() {
     this.maestroService.listarTipoDocumentos().subscribe(
      response => {
        this.tipoDocumentos = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  listarTipoUso() {
    this.maestroService.listarTipoUso().subscribe(
      response => {
        this.tipoUsos = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  listarTipoOperador() {
    this.maestroService.listarTipoOperador().subscribe(
      response => {
        this.tipoOperadores = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  listarTipoDirecciones() {
    this.maestroService.listarTipoDirecciones().subscribe(
      response => {
        this.tipoDirecciones = response;
      },
      error => console.log(error)
    );
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

  modalDireccion(accion, item) {
    const modal = this.modalService.open(GestionarDireccionComponent, {size: 'lg', scrollable: true});
    modal.result.then(
      this.closeModalDireccion.bind(this),
      this.closeModalDireccion.bind(this)
    );
    modal.componentInstance.accion = accion;
    modal.componentInstance.direccion = item;
  }

  closeModalDireccion() {

  }

  modalTelefono(accion, item) {
    const modal = this.modalService.open(GestionarTelefonoComponent, {size: 'lg', scrollable: true, centered: true});
    modal.result.then(
      this.closeModalTelefono.bind(this),
      this.closeModalTelefono.bind(this)
    );
    modal.componentInstance.accion = accion;
    modal.componentInstance.telefono = item;
  }

  closeModalTelefono() {
  }

  modalCorreo(accion, item) {
    const modal = this.modalService.open(GestionarCorreoComponent, {size: 'lg', scrollable: true, centered: true});
    modal.result.then(
      this.closeModalCorreo.bind(this),
      this.closeModalCorreo.bind(this)
    );
    modal.componentInstance.accion = accion;
    modal.componentInstance.correos = this.correos;
    modal.componentInstance.correo = item;
  }

  closeModalCorreo() {
  }


  getNameTypeUse(item) {
    const obj = this.tipoUsos.find( v => v.codItem == item.tipo);
    return obj ? obj.descripcion : '';
  }

  getNameTypeOperator(item) {
    const obj = this.tipoOperadores.find( v => v.codItem == item.tipo);
    return obj ? obj.descripcion : '';
  }

  getNameTypeAddress(item) {
    const obj = this.tipoDirecciones.find( v => v.codItem == item.tipoDireccion);
    return obj ? obj.descripcion : '';
  }

  getNameTypeDocumets(item) {
    const obj = this.tipoDocumentos.find( v => v.codItem == item.tipoDocumento);
    return obj ? obj.descripcion : '';
  }
}
