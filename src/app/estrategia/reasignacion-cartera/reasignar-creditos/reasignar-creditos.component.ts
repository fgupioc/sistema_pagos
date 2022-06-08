import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {EjecutivoCartera, EjecutivoCarteraEtapa} from '../../../models/ejecutivo-cartera';
import {Autorizacion} from '../../../comun/autorzacion';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {CONST} from '../../../comun/CONST';
import Swal from 'sweetalert2';
import {ModalAgregarCreditoComponent} from '../../asignacion-cartera/modal-agregar-credito/modal-agregar-credito.component';
import * as moment from 'moment';
import {InfoCampo} from '../../asignacion-cartera/ejecutivo-creditos/ejecutivo-creditos.component';
import {FUNC} from '../../../comun/FUNC';
import {ToastrService} from 'ngx-toastr';
import {Credito} from '../../../interfaces/credito';
import {EjecutivoCreditoReasignacion} from '../../../models/ejecutivo-credito-reasignacion';
import {EjecutivoCredito} from '../../../models/ejecutivo-credito';

@Component({
  selector: 'app-reasignar-creditos',
  templateUrl: './reasignar-creditos.component.html',
  styleUrls: ['./reasignar-creditos.component.css']
})
export class ReasignarCreditosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  ejecutivo: any;
  ejecutivoUuid: any;
  ejecutivoNombre: string;
  asignacionUuid: string;
  creditos: EjecutivoCreditoReasignacion[] = [];
  campania: EjecutivoCartera;
  tipoCreditos: InfoCampo[] = [];
  sedes: InfoCampo[] = [];
  montos: InfoCampo[] = [];
  role: string;
  FUNC = FUNC;
  A = Autorizacion;
  $creditosCheched: EjecutivoCreditoReasignacion[] = [];
  ejecutivos: any[] = [];
  nuevoGestor = '';
  asgnacion: EjecutivoCredito;

  constructor(
    private auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public config: NgbModalConfig,
    private modalService: NgbModal,
    public menuS: MenuService,
    private toastr: ToastrService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    const {role} = activatedRoute.snapshot.data;
    if (role) {
      this.role = role;
      activatedRoute.params.subscribe(({asignacionUuid}) => {
        if (asignacionUuid) {
          this.ejecutivoUuid = auth.loggedUser.uuid;
          this.asignacionUuid = asignacionUuid;
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/mis-cartera-asignadas');
        }
      });
    } else {
      activatedRoute.params.subscribe(({asignacionUuid, ejecutivoUuid}) => {

        if (asignacionUuid == undefined || ejecutivoUuid == undefined || asignacionUuid == 'undefined' || ejecutivoUuid == 'undefined') {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }
        if (asignacionUuid && ejecutivoUuid) {
          this.ejecutivoUuid = ejecutivoUuid;
          this.asignacionUuid = asignacionUuid;
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera/' + ejecutivoUuid + '/listado');
        }
      });
    }
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    if (this.ejecutivoUuid && this.asignacionUuid) {
      this.obtenerAsignnacionPorId(this.asignacionUuid);
    }
    this.listarEjecutivos();
  }

  obtenerAsignnacionPorId(asignacioUuid: any) {
    this.spinner.show();
    this.tipoCreditos = [];
    this.sedes = [];
    this.montos = [];

    this.asignacionCarteraService.listarCreditoReasignarPorAsignacionUuid(asignacioUuid).subscribe(
      res => {
        this.creditos = res.creditos;
        if (this.creditos.length > 0) {
          if (res.gestor) {
            this.ejecutivo = {
              id: res.gestor.id,
              uuid: res.gestor.uuid,
              alias: res.gestor.alias
            };
          }
          this.asgnacion = res.asignacion;
          const etapas: EjecutivoCarteraEtapa[] = [
            {
              nombreGestion: this.creditos[0].etapa,
              nombreEtapa: this.creditos[0].subEtapa,
              desde: this.creditos[0].desde,
              hasta: this.creditos[0].hasta,
            }
          ];
          this.campania = {
            id: this.creditos[0].asignacionId,
            frecuencia: this.creditos[0].frecuencia,
            startDate: this.creditos[0].fechaInicio,
            endDate: this.creditos[0].fechaFinal,
            etapaItems: etapas
          };
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        if (this.role) {
          this.router.navigateByUrl('/auth/estrategia/reasigacion-cartera');
        } else {
          this.router.navigateByUrl(`/auth/estrategia/reasigacion-cartera/gestor/${this.ejecutivoUuid}/mis-asignaciones`);
        }
      }
    );
  }

  get conPermiso() {
    if (this.campania) {
      return moment().isBetween(this.campania.startDate, this.campania.endDate);
    } else {
      return false;
    }
  }

  refreshDatatable() {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }


  changeCheckCreditos(event: any, credito: EjecutivoCreditoReasignacion, inputAll: HTMLInputElement) {
    const exist = this.$creditosCheched.find(i => i.creditoId == credito.creditoId);
    if (event.target.checked) {
      if (!exist) {
        this.$creditosCheched.push(credito);
      }
    } else {
      this.$creditosCheched = this.$creditosCheched.filter(i => i.creditoId != credito.creditoId);
    }
  }

  isChecked(o: any): boolean {
    return !!this.$creditosCheched.find(i => i.numCredito == o.numCredito);
  }

  seleccionarTodos(e: any) {
    if (this.creditos.length > 0) {
      if (e.target.checked) {
        this.$creditosCheched = this.creditos.filter(r => r.reasignar);
      } else {
        this.$creditosCheched = [];
      }
    }
  }

  listarEjecutivos() {
    this.spinner.show();
    this.asignacionCarteraService.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  reasignarGestor() {
    if (this.$creditosCheched.length == 0) {
      this.toastr.warning('Debe seleccionar almenos un crédito.');
      return;
    }

    if (this.nuevoGestor == '' || Number(this.nuevoGestor) == Number(this.ejecutivo.id)) {
      this.toastr.warning('Debe seleccionar un nuevo gestor.');
      return;
    }

    this.campania.codUsuario = Number(this.nuevoGestor);
    const creditos = [];
    for (const item of this.$creditosCheched) {
      creditos.push({id: item.creditoId});
    }
    this.campania.creditosAsignados = creditos;
    this.spinner.show();
    this.asignacionCarteraService.reasignarCreditos(this.campania.id, this.campania).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Reasignación', res.mensaje, 'success');
          this.router.navigateByUrl(`/auth/estrategia/reasigacion-cartera/gestor/${this.ejecutivoUuid}/mis-asignaciones`);
        } else {
          Swal.fire('Reasignación', res.mensaje, 'error');
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  regresarCreditos() {
    Swal.fire({
      title: '¿Estás Seguro?',
      text: 'Regresarán todos los créditos que fueron reasignados, al gestor ' + this.ejecutivo.alias,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Regresar!',
      cancelButtonText: 'Cancelar'
    }).then(({value}) => {
      if (value) {
        this.devolverCreditos();
      }
    });
  }

  devolverCreditos() {
    // console.log(this.ejecutivoUuid);
    // console.log(this.asignacionUuid);
    this.spinner.show();
    this.asignacionCarteraService.devolverCreditoGestorOriginal(this.ejecutivoUuid, this.asignacionUuid).subscribe(
      res => {
        Swal.fire(
          'Devuelto!',
          'Los créditos regresaron al gestor ' + this.ejecutivo.alias,
          'success'
        );
        this.router.navigateByUrl(`/auth/estrategia/reasigacion-cartera/gestor/${this.ejecutivoUuid}/mis-asignaciones`);
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  get asignacionVencida() {
    return !(moment().isBetween(this.asgnacion.startDate, this.asgnacion.endDate));
  }

  get creditosAsignadoAOtros() {
    return this.creditos.filter(i => i.actualEjecutivoId != this.ejecutivo.id).length > 0;
  }
}
