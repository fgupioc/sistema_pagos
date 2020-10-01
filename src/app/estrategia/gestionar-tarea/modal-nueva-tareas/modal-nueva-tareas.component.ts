import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {Task} from '../tarea-detalle/tarea-detalle.component';
import {Credito} from '../../../interfaces/credito';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {Persona} from '../../../interfaces/Persona';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Telefono} from '../../../interfaces/telefono';
import {CONST} from '../../../comun/CONST';
import {Email} from '../../../interfaces/email';
import {Direccion} from '../../../interfaces/direccion';
import {TipoNotificacion} from '../../../models/tipo-notificacion';
import {TipoNotificacionService} from '../../../servicios/tipo-notificacion.service';

@Component({
  selector: 'app-modal-nueva-tareas',
  templateUrl: './modal-nueva-tareas.component.html',
  styleUrls: ['./modal-nueva-tareas.component.css']
})

export class ModalNuevaTareasComponent implements OnInit {
  formRecordatorio: FormGroup;
  $tarea: Task;
  name: any;
  tarea: Task;
  showActividades = false;
  editDescription = false;
  editVencimiento = false;
  checkVencimiento: any;
  creditos: Credito[] = [];
  credito: Credito;
  tipoActividades: TablaMaestra[] = [];
  socio: Persona;
  showItem: any;
  dateDefault = moment(new Date()).format('YYYY-MM-DD');
  tipoNotificaciones: TipoNotificacion[] = [];
  $telefonos: Telefono[] = [];
  editName = false;
  checkRecordatorio: boolean;
  checkNotification = false;
  checkEmail = false;
  checkNotificationexpiration: any;
  priority = 0;
  files: File[] = [];
  showDropzone = false;

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal,
    private tablaMaestraService: MaestroService,
    private formBuilder: FormBuilder,
    private tipoNotificacionService: TipoNotificacionService,
  ) {
  }

  ngOnInit() {
    this.listarTipoActividades();
    this.loadTipoNotificaciones();
    this.formRecordatorio = this.formBuilder.group({
      asignacionId: [],
      ejecutivoId: [],
      socioId: [],
      creditoId: [],
      fecha: [this.dateDefault, [Validators.required]],
      hora: ['', [Validators.required]],
      tipoActividad: ['', [Validators.required]],
      numeroTelefono: [''],
      correo: [''],
      tipoMetodo: [''],
      direccion: [''],
      comentario: [''],
    });
    if (this.tarea) {
      this.$tarea = Object.assign({}, this.tarea);
      if (!this.tarea.fechaVencimiento) {
        this.newVencimiento();
      }
    }
  }


  crear() {

  }

  changeVencimiento(event: any) {
    console.log(event);
  }

  newVencimiento() {
    if (!this.tarea.fechaVencimiento) {
      this.tarea.fechaVencimiento = moment(new Date()).format('YYYY-MM-DD');
      this.tarea.fechaHora = moment(new Date()).format('HH:mm');
    } else {
      this.tarea.fechaVencimiento = moment(this.tarea.fechaVencimiento).format('YYYY-MM-DD');
    }
    this.editVencimiento = true;
  }

  get checedCumplido() {
    if (this.estaFechaVencida() && !this.checkVencimiento) {
      return 2;
    } else if (this.checkVencimiento) {
      return 1;
    } else {
      return 0;
    }
  }

  estaFechaVencida() {
    return moment().isAfter(moment(this.$tarea.fechaVencimiento).format('YYYY-MM-DD'));
  }

  changeCredito(event: any) {
    const item = this.creditos.find(i => i.id == event);
    if (item) {
      this.obtenerSocio(item.socioId);
    } else {
      this.socio = null;
    }
  }

  obtenerSocio(codSocio) {
    this.spinner.show();
    this.asignacionCarteraService.buscarSocioByCodUsuario(codSocio).subscribe(
      res => {
        if (res.exito) {
          this.socio = res.objeto;
        } else {
          this.socio = null;
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        this.socio = null;
      }
    );
  }

  private listarTipoActividades() {
    this.tablaMaestraService.listarTipoActividades().subscribe(
      res => {
        this.tipoActividades = res;
      }
    );
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

  public get showCellphones(): Telefono[] {
    const index = [CONST.C_INT_SMS, CONST.C_INT_WHATSAPP, CONST.C_INT_TELEGRAM];
    const phones: Telefono[] = [];
    this.socio.telefonos.forEach(item => {
      if (index.includes(item.codTipoNotificacion)) {
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

  public get listadoMensaje(): TipoNotificacion[] {
    const index = [CONST.C_INT_SMS, CONST.C_INT_WHATSAPP, CONST.C_INT_TELEGRAM];
    return this.tipoNotificaciones.filter(item => index.includes(item.codTipoNotificacion));
  }

  private loadTipoNotificaciones() {
    this.tipoNotificacionService.getAll().subscribe(
      res => this.tipoNotificaciones = res
    );
  }

  cambioTipoMetodo(event: any) {
    this.socio.telefonos.forEach(item => {
      if (event == item.tipoNotificacion) {
        const exit = this.$telefonos.find(i => i.numero == item.numero);
        if (!exit) {
          this.$telefonos.push(item);
        }
      }
    });
    return this.$telefonos;
  }

  get getClassPriority() {
    if (this.priority == 1) {
      return 'success';
    } else if (this.priority == 2) {
      return  'danger';
    } else {
      return 'info';
    }
  }


  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
