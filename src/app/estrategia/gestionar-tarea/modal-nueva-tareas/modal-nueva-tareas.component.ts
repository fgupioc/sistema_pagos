import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
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
import {Tarea} from '../../../interfaces/tarea';
import {FUNC} from '../../../comun/FUNC';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Recordatorio} from '../../../interfaces/recordatorio';
import {TareaActividad} from '../../../interfaces/tarea-actividad';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import {HttpEventType} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {TareaArchivo} from '../../../interfaces/tarea-archivo';
import {EventosService} from '../../../servicios/eventos.service';
import {Autorizacion} from '../../../comun/autorzacion';
import {MenuService} from '../../../servicios/sistema/menu.service';

const urlBaseFotos = environment.signinUrl + '/upload/';

@Component({
  selector: 'app-modal-nueva-tareas',
  templateUrl: './modal-nueva-tareas.component.html',
  styleUrls: ['./modal-nueva-tareas.component.css']
})

export class ModalNuevaTareasComponent implements OnInit {
  formRecordatorio: FormGroup;
  $tarea: Tarea;
  name: any;
  tarea: Tarea;
  editDescription = false;
  editVencimiento = false;
  creditos: Credito[] = [];
  creditosAll: Credito[] = [];
  credito: Credito;
  tipoActividades: TablaMaestra[] = [];
  estadosRecordatorio: TablaMaestra[] = [];
  socio: Persona;
  showItem: any;
  dateDefault = moment(new Date()).format('YYYY-MM-DD');
  tipoNotificaciones: TipoNotificacion[] = [];
  $telefonos: Telefono[] = [];
  editName = false;
  priority = 0;
  files: File[] = [];
  showDropzone = false;
  ejecutivoId: any;
  creditoId: any = '';
  comentario = '';
  actividades: any[] = [];
  userLoggedName: any;
  progresos: any[] = [];
  archivos: TareaArchivo[] = [];
  role: string;
  horaA: any;
  minA: any;
  tiempoA: any;
  horaB: any;
  minB: any;
  tiempoB: any;
  $horario: any[] = [];
  A = Autorizacion;

  constructor(
    public auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal,
    private tablaMaestraService: MaestroService,
    private formBuilder: FormBuilder,
    private tipoNotificacionService: TipoNotificacionService,
    private gestionAdministrativaService: GestionAdministrativaService,
    private eventosService: EventosService,
    public menuS: MenuService
  ) {
    this.userLoggedName = auth.loggedUser.alias;
  }

  ngOnInit() {
    this.loadCreditos(this.ejecutivoId);
    this.listarTipoActividades();
    this.loadTipoNotificaciones();
    this.loadEstadosRecordatorios();
    for (let index = 1; index <= 12; index++) {
      if (index < 10) {
        this.$horario.push('0' + index);
      } else {
        this.$horario.push(index);
      }
    }
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
      this.listarActividadPorTarea();
      this.listarArchivosPorTarea();
      const task = Object.assign({}, this.tarea);
      this.$tarea = task;
      this.creditoId = this.tarea.creditoId;
      if (this.tarea.creditoId) {
        this.credito = this.creditosAll.find(i => i.id == this.tarea.creditoId);
        this.creditos.push(this.credito);
      }
      if (this.$tarea.socioId) {
        this.obtenerSocio(this.$tarea.socioId);
      }

      if (!this.tarea.fechaVencimiento) {
        this.newVencimiento();
      } else {
        this.$tarea.fechaVencimiento = moment(task.fechaVencimiento).format('YYYY-MM-DD');
        this.$tarea.fechaRecordatorio = moment(task.fechaRecordatorio).format('YYYY-MM-DD');
      }
      this.allHoraRecordatorio();
    }
  }


  crear() {
    if (this.$tarea.nombre && this.$tarea.nombre.trim().length == 0) {
      Swal.fire('Actualizar Tarea', 'El nombre de la tarea es obligatorio', 'warning');
      return;
    }

    this.$tarea.codActividad = this.formRecordatorio.controls.tipoActividad.value;
    if (!this.$tarea.checkFechaRecordatorio) {
      this.$tarea.fechaRecordatorio = null;
      this.$tarea.horaRecordatorio = null;
      this.$tarea.correo = false;
      this.$tarea.notificacion = false;
      this.$tarea.notificacionVencimiento = false;
    }

    if (!this.$tarea.checkFechaVencimiento) {
      this.$tarea.checkFechaVencimiento = false;
    }

    this.$tarea.creditoId = this.credito.id;
    this.spinner.show();
    this.gestionAdministrativaService.actualizarTarea(this.$tarea).subscribe(
      res => {
        if (res.exito) {
          this.activeModal.dismiss(res);
        } else {
          Swal.fire('Actualizar Tareas', res.mensaje ? res.mensaje : 'Error', 'warning');
          this.spinner.hide();
        }
      },
      err => {
        Swal.fire('Actualizar Tareas', 'Ocurrio un error', 'success');
        this.spinner.hide();
      }
    );
  }

  loadEstadosRecordatorios() {
    this.tablaMaestraService.loadEstadosRecordatorios().subscribe(
      res => this.estadosRecordatorio = res
    );
  }

  changeRecordatorio(event: any, element: HTMLInputElement) {
    if (event.target.checked) {
      if (this.$tarea.fechaVencimiento && this.$tarea.horaVencimiento) {
        this.$tarea.fechaRecordatorio = this.$tarea.fechaVencimiento;
        this.allHoraRecordatorio();
      } else {
        Swal.fire('Tarea', 'Debe ingresar una fecha de vencimiento y hora de vencimiento', 'warning');
        element.checked = false;
        return;
      }
    } else {
      this.$tarea.fechaRecordatorio = null;
      this.$tarea.horaRecordatorio = null;
      this.horaB = '';
      this.minB = '';
      this.tiempoB = '';
    }
  }

  newVencimiento() {
    const time = moment(new Date()).add(1, 'hours').format('HH:mm');
    const hora = time.split(':');
    this.tiempoA = 'am';
    if (Number(hora[0]) > 12) {
      this.tiempoA = 'pm';
    }
    this.horaA = hora[0];
    this.minA = '00';
    if (Number(hora[1]) > 30) {
      this.minA = '30';
    }

    if (!this.tarea.fechaVencimiento) {
      this.tarea.fechaVencimiento = moment(new Date()).format('YYYY-MM-DD');
      if (this.$tarea.horaVencimiento) {
        const $hora = this.$tarea.horaVencimiento.split(':');
        this.tarea.horaVencimiento = `${$hora[0]}:${$hora[1]}`;
        if (Number($hora[0]) > 12) {
          this.tiempoA = 'pm';
        } else {
          this.tiempoA = 'am';
        }
      } else {
        this.tarea.horaVencimiento = `${this.horaA}:${this.minA}`;
        if (Number(this.horaA) > 12) {
          this.tiempoA = 'pm';
        } else {
          this.tiempoA = 'am';
        }
      }
      this.editVencimiento = false;
    } else {
      this.$tarea.fechaVencimiento = moment(this.tarea.fechaVencimiento).format('YYYY-MM-DD');
      this.editVencimiento = true;
    }
  }


  get checedCumplido() {
    if (this.estaFechaVencida() && !this.$tarea.checkFechaVencimiento) {
      this.$tarea.condicion = '2';
      this.tarea.condicion = '2';
      return '2';
    } else if (this.$tarea.checkFechaVencimiento) {
      this.$tarea.condicion = '1';
      this.tarea.condicion = '1';
      return '1';
    } else {
      this.$tarea.condicion = '0';
      this.tarea.condicion = '0';
      return '0';
    }
  }

  estaFechaVencida() {
    return moment().isAfter(moment(this.$tarea.fechaVencimiento + ' ' + this.$tarea.horaVencimiento));
  }

  changeCredito(event: any) {
    this.credito = null;
    const item = this.creditos.find(i => i.id == event);
    if (item) {
      this.credito = item;
      this.creditoId = item.id;
      this.$tarea.asignacionId = item.asignacionId;
      this.$tarea.socioId = item.socioId;
    } else {
      this.socio = null;
    }
  }

  obtenerSocio(codSocio) {
    setTimeout(() => this.spinner.show(), 10);
    this.asignacionCarteraService.buscarSocioByCodUsuario(codSocio).subscribe(
      res => {
        if (res.exito) {
          this.socio = res.objeto;
          /*
          this.credito = this.creditos.find(i => i.carteraId == this.$tarea.creditoId);
          this.creditoId = this.credito ? this.credito.id : '';
           */
          this.formRecordatorio.controls.tipoActividad.setValue(this.$tarea.codActividad);
          if (this.auth.loggedUser.id != this.$tarea.usuarioId || this.$tarea.estado != '1') {
            this.showItem = this.$tarea.codActividad;
            this.formRecordatorio.controls.tipoActividad.disable();
          }
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
    return FUNC.getClassPriority(this.$tarea.prioridad);
  }


  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  get getNameList() {
    return FUNC.getNombreLista(this.tarea.etapaActual);
  }

  get getNamePriority() {
    return FUNC.getNamePriority(this.$tarea.prioridad);
  }

  isCurrentDate(fecha: string, condicion: string) {
    const date = moment(fecha).format('YYYY-MM-DD');
    if (this.dateDefault == date && condicion != '2') {
      return 'table-primary';
    }
    if (this.dateDefault == date && condicion == '2') {
      return 'table-success';
    }
    if (moment().isAfter(fecha) && condicion != '2') {
      return 'table-danger';
    }
    if (moment().isAfter(fecha) && condicion == '2') {
      return 'table-success';
    }
  }

  getNameActividad(tipoActividad: string) {
    const item = this.tipoActividades.find(i => i.codItem == tipoActividad);
    return item ? item.descripcion : '';
  }

  getDescripcion(item: Recordatorio) {
    let msj = '';
    if (item.numeroTelefono) {
      msj = item.numeroTelefono;
      if (item.tipoMetodo) {
        msj += ` - ${item.tipoMetodo}`;
      }
    }

    if (item.correo) {
      msj = item.correo;
      if (item.tipoMetodo) {
        msj += ` - ${item.tipoMetodo}`;
      }
    }

    if (item.direccion) {
      msj = item.direccion;
    }
    return msj;
  }

  getNameCondition(condicion: any) {
    const item = this.estadosRecordatorio.find(i => i.codItem == condicion);
    return item ? item.descripcion : '';
  }

  guardarCometario() {
    if (this.comentario.trim().length == 0) {
      Swal.fire('Crear Comentario', 'Debe ingresar un comentario valido.', 'warning');
      return;
    }
    const comment: TareaActividad = {
      tareaId: this.tarea.id,
      comentario: this.comentario,
    };
    this.spinner.show();
    this.gestionAdministrativaService.crearTareaComentario(comment).subscribe(
      res => {
        if (res.exito) {
          this.comentario = '';
          Swal.fire('Crear Comentario', res.mensaje, 'success');
          this.listarActividadPorTarea();
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  listarActividadPorTarea() {
    this.gestionAdministrativaService.listarActividadPorTarea(this.tarea.id).subscribe(
      res => {
        if (res.exito) {
          this.actividades = res.objeto as any[];
        }
      }
    );
  }

  listarArchivosPorTarea() {
    this.gestionAdministrativaService.listarTareaAchivos(this.tarea.id).subscribe(
      res => {
        if (res.exito) {
          this.archivos = res.objeto as any[];
        }
      }
    );
  }

  desactivarActividad(item: any) {
    Swal.fire({
      text: 'Estas segura de eliminar la actividad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.gestionAdministrativaService.desactivarTareaComentario(item.id).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Actividad', res.mensaje, 'success');
              this.spinner.hide();
              this.listarActividadPorTarea();
            }
          }
        );
      }
    });
  }

  subirArchivos() {
    for (const file of this.files) {
      this.gestionAdministrativaService.subirArchivosTarea(file, this.tarea.id, FUNC.getFileExtension(file.name)).subscribe(
        event => {
          if (event.type == HttpEventType.UploadProgress) {
            const progreso = Math.round((event.loaded / event.total) * 100);
            this.progresos.push({
              name: file.name,
              progress: progreso,
              ok: true,
            });
          } else if (event.type == HttpEventType.Response) {
            const res = event.body;
          }
        },
        err => {
          this.progresos.push({
            name: file.name,
            progress: 0,
            ok: false,
          });
          console.log(err);
        }
      );
    }
    this.showDropzone = false;
    this.files = [];
    setTimeout(() => {
      this.progresos = [];
      this.listarArchivosPorTarea();
    }, 6000);
  }

  getUrl(file) {
    return `${urlBaseFotos}${this.tarea.id}/images/${file.url}`;
  }

  getUrlDownload(file) {
    // http://192.169.1.130/icollect/upload/123/download/documento1.pdf
    return `${urlBaseFotos}${this.tarea.id}/download/${file.url}`;
  }

  isImage(tipo) {
    const extens = ['PNG', 'JPG', 'JPEG'];
    return extens.includes(tipo.toUpperCase());
  }

  isFormatImage(tipo) {
    const extens = ['image/png', 'image/jpg', 'image/jpeg'];
    return extens.includes(tipo);
  }

  eliminarArchivo(item: any) {
    Swal.fire({
      text: 'Estas segura de eliminar el archivo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.gestionAdministrativaService.eliminarTareaAchivos(this.tarea.id, item.id).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Archivo', res.mensaje, 'success');
              this.spinner.hide();
              this.listarArchivosPorTarea();
            }
          }
        );
      }
    });
  }

  chengeFehcaRecordatorio(event: any, element: HTMLInputElement) {
    if (moment(this.$tarea.fechaVencimiento).isBefore(event)) {
      this.$tarea.fechaRecordatorio = this.$tarea.fechaVencimiento;
      element.value = this.$tarea.fechaVencimiento;
    } else {
      if (moment().isAfter(event)) {
        this.$tarea.fechaRecordatorio = this.$tarea.fechaVencimiento;
        element.value = moment().format('YYYY-MM-DD');
      } else {
        this.$tarea.fechaRecordatorio = event;
      }
    }
  }

  get getTime() {
    if (this.$tarea.horaVencimiento) {
      const time = Number(this.$tarea.horaVencimiento.slice(0, 2)) - 1;
      return time < 10 ? `0${time}:00` : `${time}:00`;
    } else {
      return '09:00';
    }
  }

  cancelarTarea() {
    if (this.$tarea.usuarioId != this.auth.loggedUser.id) {
      Swal.fire('Cancelar Tarea', 'No puede cancelar esta tarea.', 'warning');
      return;
    }
    Swal.fire({
      text: 'Esta seguro de calcelar la tarea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Cancelar',
      cancelButtonText: 'No, Mantener'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.gestionAdministrativaService.cancelarTarea(this.$tarea.id).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('Cancelar Tarea', res.mensaje, 'success');
              this.activeModal.dismiss(res);
            } else {
              Swal.fire('Cancelar Tarea', res.mensaje, 'error');
              this.spinner.hide();
            }
          },
          error => {
            Swal.fire('Cancelar Tarea', 'Ocurrio un error', 'error');
            this.spinner.hide();
          }
        );
      }
    });
  }

  leerComentarios(event: any) {
    if (event.panelId == '003') {
      this.gestionAdministrativaService.leerComentariosPorTarea(this.tarea.id).subscribe(
        res => {
          if (res.exito) {
            this.eventosService.leerNotifyEmitter.emit({tipo: '04', id: this.tarea.id});
            console.log(res);
          }
        }
      );
    }
  }

  cambioHoraVencimient() {
    const $hora = (this.tiempoA == 'am') ? this.horaA : String(Number(this.horaA) + 12);
    this.$tarea.horaVencimiento = `${$hora}:${this.minA}`;
    if (this.$tarea.checkFechaRecordatorio) {
      this.allHoraRecordatorio();
    } else {
      this.horaB = '';
      this.minB = '';
      this.tiempoB = '';
    }
  }

  allHoraRecordatorio() {
    if (this.$tarea.horaVencimiento) {
      const $time = this.$tarea.horaVencimiento.split(':');
      this.horaB = (Number($time[0]) > 12 ? ((Number($time[0]) - 12) < 10 ? '0' + (Number($time[0]) - 12) : String(Number($time[0]) - 12)) : $time[0]);
      this.minB = (this.minA == '00') ? '30' : '00';
      if (Number($time[0]) > 12) {
        this.tiempoB = 'pm';
      } else {
        this.tiempoB = 'am';
      }
      this.$tarea.horaRecordatorio = `${this.horaB}:${this.minB}`;
    }

  }

  cambioHoraRecordatorio() {
    const $hora = this.tiempoB == 'am' ? this.horaB : String(Number(this.horaB) + 12);
    this.$tarea.horaRecordatorio = `${$hora}:${this.minB}`;
  }

  loadCreditos(ejecutivoId: any) {
    if (ejecutivoId) {
      this.gestionAdministrativaService.onteberCreditosDeAsignacionesActivasPorEjecutivo(ejecutivoId).subscribe(
        res => {
          if (res.exito) {
            if (res.objeto) {
              this.creditos = res.objeto as Credito[];
            }
          }
          this.spinner.hide();
        },
        err => {
          Swal.fire('Tareas', 'El tablero de tareas no existe', 'error');
          this.spinner.hide();
        }
      );
    }

  }
}
