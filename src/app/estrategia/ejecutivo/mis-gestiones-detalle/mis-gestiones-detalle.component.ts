import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Credito} from '../../../interfaces/credito';
import {FUNC} from '../../../comun/FUNC';
import {Cartera, Etapa} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {Persona} from '../../../interfaces/Persona';
import {CONST} from '../../../comun/CONST';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Telefono} from '../../../interfaces/telefono';
import {Email} from '../../../interfaces/email';
import {Direccion} from '../../../interfaces/direccion';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {CreditoGestion} from '../../../interfaces/credito-gestion';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import * as moment from 'moment';

@Component({
  selector: 'app-mis-gestiones-detalle',
  templateUrl: './mis-gestiones-detalle.component.html',
  styleUrls: ['./mis-gestiones-detalle.component.css']
})
export class MisGestionesDetalleComponent implements OnInit {
  form: FormGroup;
  creditoId: any;
  credito: Credito;
  cartera: Cartera;
  funciones = FUNC;
  socio: Persona;
  etapa: Etapa;
  showRespuesta = false;
  tipoVias: TablaMaestra[] = [];
  acciones: CreditoGestion[] = [];

  gestiones: TablaMaestra[] = [];
  respuestas: TablaMaestra[] = [];
  tiposContacto: TablaMaestra[] = [];

  constructor(
    private auth: AutenticacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private gestionAdministrativaService: GestionAdministrativaService,
    private formBuilder: FormBuilder,
    private tablaMaestraService: MaestroService,
  ) {
    activatedRoute.params.subscribe(({creditoId}) => this.creditoId = creditoId);
  }

  ngOnInit() {
    this.listarTipoVias();
    this.listarTiposGestiones();
    this.listarTiposRespuestas();
    this.listarTiposContactos();

    if (this.creditoId) {
      this.loadCredito();
    }
    this.form = this.formBuilder.group({
      tipoGestion: ['001', Validators.required],
      tipoContacto: ['1', Validators.required],
      telefono: [''],
      duracion: [''],
      correo: [''],
      direccion: [''],
      codRespuesta: ['001', Validators.required],
      comentario: ['', Validators.required],
    });
  }

  listarTipoVias() {
    this.tablaMaestraService.listarTipoVias().subscribe(
      response => {
        this.tipoVias = response;
      },
      error => console.log(error)
    );
  }

  listarTiposGestiones() {
    this.tablaMaestraService.listarTiposGestiones().subscribe(
      response => {
        this.gestiones = response;
      },
      error => console.log(error)
    );
  }

  listarTiposRespuestas() {
    this.tablaMaestraService.listarTiposRespuestas().subscribe(
      response => {
        this.respuestas = response;
      },
      error => console.log(error)
    );
  }

  listarTiposContactos() {
    this.tablaMaestraService.listarTiposContactos().subscribe(
      response => {
        this.tiposContacto = response.filter(i => i.codItem != '3');
      },
      error => console.log(error)
    );
  }

  listarAcciones(creditoId, asignacionId) {
    this.gestionAdministrativaService.buscarCreditoAsignacionAccion(creditoId, asignacionId).subscribe(
      res => {
        if (res.exito) {
          this.acciones = res.acciones;
        }
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }


  loadCredito() {
    this.spinner.show();
    this.gestionAdministrativaService.buscarCreditoPorId(this.creditoId).subscribe(
      res => {
        if (res.exito) {
          this.credito = res.credito;
          this.cartera = res.cartera;
          this.socio = res.socio;
          this.etapa = res.etapa;
          this.listarAcciones(this.credito.id, this.credito.asignacionId);
        } else {
          Swal.fire('Credito', res.mensaje, 'error');
          this.router.navigateByUrl('/auth/gestion-administrativa/mis-gestiones');
        }
      },
      err => {
        this.spinner.hide();
        Swal.fire('Credito', 'Ocurrio un error', 'error');
        this.router.navigateByUrl('/auth/gestion-administrativa/mis-gestiones');
      }
    );
  }

  get typeDocumentDescription() {
    if (this.socio) {
      if (this.socio.personaNatural) {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_DNI);
        return docmento ? docmento.tipoDocumentoDescripcion : '';
      } else {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_RUC);
        return docmento ? docmento.tipoDocumentoDescripcion : '';
      }
    } else {
      return '';
    }
  }

  get documentNumber() {
    if (this.socio) {
      if (this.socio.personaNatural) {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_DNI);
        return docmento ? docmento.numeroDocumento : '';
      } else {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_RUC);
        return docmento ? docmento.numeroDocumento : '';
      }
    } else {
      return '';
    }
  }

  get regla() {
    if (this.etapa) {
      return `${this.etapa.nombre}(${this.etapa.desde} - ${this.etapa.hasta})`;
    } else {
      return '';
    }
  }

  iniciarGestion() {
    this.showRespuesta = true;
    this.form.controls.tipoGestion.disable();
    this.form.controls.tipoContacto.disable();
  }

  cancelarGestion() {
    this.form.reset({
      tipoGestion: '001',
      tipoContacto: '1',
      telefono: '',
      duracion: '',
      correo: '',
      direccion: '',
      codRespuesta: '001',
      comentario: '',
    });
    this.showRespuesta = false;
    this.form.controls.tipoGestion.enable();
    this.form.controls.tipoContacto.enable();
  }

  public get showPhones(): Telefono[] {
    const phones: Telefono[] = [];
    this.socio.telefonos.forEach(item => {
      if (item.codTipoNotificacion == CONST.C_INT_LLAMADAS) {
        const exit = phones.find(i => i.numero == item.numero);
        if (!exit) {
          phones.push(item);
        }
      }
    });
    return phones;
  }

  public get showEmails(): Email[] {
    const index = [CONST.C_INT_MESSAGER, CONST.C_INT_EMAIL];
    const emails: Email[] = [];
    this.socio.correos.forEach(item => {
      if (index.includes(item.codTipoNotificacion)) {
        const exit = emails.find(i => i.email == item.email);
        if (!exit) {
          emails.push(item);
        }
      }
    });
    return emails;
  }

  public get showAddress(): Direccion[] {
    return this.socio.direcciones;
  }

  mostrarDireccion(dir: Direccion): string {
    let address = '';
    if (dir.tipoVia) {
      address = this.getNombreTipoVia(dir.tipoVia);
    }

    if (dir.nombreVia) {
      address += address != '' ? ' ' + dir.nombreVia : dir.nombreVia;
    }

    if (dir.numero) {
      address += address != '' ? ' NRO ' + dir.numero : 'NRO ' + dir.numero;
    }

    if (dir.manzana) {
      address += address != '' ? ' MZA ' + dir.manzana : 'MZA ' + dir.manzana;
    }

    if (dir.lote) {
      address += address != '' ? ' LOTE ' + dir.lote : 'LOTE ' + dir.lote;
    }
    return address;
  }

  private getNombreTipoVia(tipoVia: string) {
    const item = this.tipoVias.find(i => i.codItem == tipoVia);
    return item ? item.descripcion : '';
  }

  registrarGestion() {
    const data = this.form.getRawValue();
    this.form.reset({
      tipoGestion: '001',
      tipoContacto: '1',
      telefono: '',
      duracion: '',
      correo: '',
      direccion: '',
      codRespuesta: '001',
      comentario: '',
    });
    this.showRespuesta = false;
    this.form.controls.tipoGestion.enable();
    this.form.controls.tipoContacto.enable();

    const gestion = this.gestiones.find(i => i.codItem == data.tipoGestion);
    const contacto = this.tiposContacto.find(i => i.codItem == data.tipoContacto);
    const respuesta = this.respuestas.find(i => i.codItem == data.codRespuesta);

    let target = '';
    if (data.telefono.length > 0) {
      target = data.telefono;
      if (data.duracion > 0) {
        target += ` (${data.duracion}seg).`;
      }
    } else if (data.correo.length > 0) {
      target = data.correo;
    } else if (data.direccion.length > 0) {
      target = data.direccion;
    }

    const accion: CreditoGestion = {
      tipoGestion: data.tipoGestion,
      tipoContacto: data.tipoContacto,
      target,
      codRespuesta: data.codRespuesta,
      comentario: data.comentario,
      duracion: data.duracion,
      usuarioId: this.auth.loggedUser.id,
      ejecutivoNombre: this.auth.loggedUser.alias,
      gestionDescripcion: gestion ? gestion.descripcion : '',
      contactoDescripcion: contacto ? contacto.descripcion : '',
      respuestaDescripcion: respuesta ? respuesta.descripcion : '',
      creditoId: this.credito.id,
      asignacionId: this.credito.asignacionId,
    };
    this.spinner.show();
    this.gestionAdministrativaService.registrarCreditoAsignacionAccion(accion).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Registrar Gestión', res.mensaje, 'success');
          this.listarAcciones(this.credito.id, this.credito.asignacionId);
          return;
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

}
