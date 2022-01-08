import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {ActualizarEtapaComponent} from '../../etapa/actualizar-etapa/actualizar-etapa.component';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {isNullOrUndefined} from 'util';
import {CONST} from '../../../comun/CONST';
import {NgxSpinnerService} from 'ngx-spinner';
import {Cartera, Gestion} from '../../../interfaces/cartera';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {FUNC} from '../../../comun/FUNC';
import {GestionService} from '../../../servicios/estrategia/gestion.service';

declare var $: any;

@Component({
  selector: 'app-actualizar-gestion',
  templateUrl: './actualizar-gestion.component.html',
  styleUrls: ['./actualizar-gestion.component.css']
})
export class ActualizarGestionComponent implements OnInit {
  formGestion: FormGroup;
  etapas: any[] = [];
  gestion: any;
  create: boolean;
  gestiones: any[] = [];
  areas: TablaMaestra[] = [];
  personaCreate: any;
  personaUpdate: any;
  $etapas: any[] = [];
  etapaEdit: any;

  constructor(
    private formBuilder: FormBuilder,
    private carteraService: CarteraService,
    public modalService: NgbModal,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private maestroService: MaestroService,
    private gestionService: GestionService
  ) {
    const state = router.getCurrentNavigation().extras.state;
    if (state && !isNullOrUndefined(state.id)) {
      this.obtenerGestion(state.id);
    } else {
      router.navigateByUrl('/auth/configuracion/gestiones');
    }
  }

  ngOnInit() {

    this.loadAreas();

    this.formGestion = this.formBuilder.group({
      codArea: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      desde: ['', [Validators.required]],
      hasta: ['', [Validators.required]],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      etapas: [],
      codEtapaTemp: [],
      desdeTemp: [],
      hastaTemp: [],
    });


  }

  eliminar(item, i) {
    Swal.fire({
      title: 'Estas segura?',
      text: 'Eliminar etapa!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if (isNullOrUndefined(item.codEtapa)) {
          this.etapas.splice(i, 1);
        } else {
          this.etapas[i].estado = CONST.S_ESTADO_REG_INACTIVO;
        }

        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        );
      }
    });
  }

  validarDesde() {
    this.formGestion.controls.hasta.setValue(0);
    const desde = Number(this.formGestion.controls.desde.value);
    if (this.create) {
      if (this.gestiones.length > 0) {
        let flag = true;
        this.gestiones.forEach(v => {
          if (desde <= v.hasta) {
            flag = false;
          }
        });
        if (!flag) {
          Swal.fire('Crear Gestión', 'La cantidad del campo desde no es valido.', 'error');
          this.formGestion.controls.desde.setValue(0);
          return;
        }
      }
    } else {
      const gestiones = this.gestiones.filter(v => v.codGestion < this.gestion.codGestion);
      if (gestiones.length > 0) {
        let flag = true;
        gestiones.forEach(v => {
          if (desde <= v.hasta) {
            flag = false;
          }
        });
        if (!flag) {
          Swal.fire('Crear Gestión', 'La cantidad del campo desde no es valido.', 'error');
          this.formGestion.controls.desde.setValue(this.gestion.desde);
          return;
        }
      }
    }
  }

  validarHasta() {
    const hasta = Number(this.formGestion.controls.hasta.value);
    const desde = Number(this.formGestion.controls.desde.value);
    if (this.create) {
      if (hasta <= desde) {
        Swal.fire('Crear Gestión', 'La cantidad del campo hasta no es valido.', 'error');
        this.formGestion.controls.hasta.setValue(0);
        return;
      }
    } else {
      if (hasta <= desde) {
        Swal.fire('Crear Gestión', 'La cantidad del campo hasta no es valido.', 'error');
        this.formGestion.controls.hasta.setValue(this.gestion.hasta);
        return;
      }
    }
  }

  loadAreas() {
    this.spinner.show();
    this.maestroService.listaTablaAreas().subscribe(
      res => {
        this.areas = res;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  private obtenerGestion(id: any) {
    this.gestionService.buscarPorCodigo(id).subscribe(
      res => {
        if (res.exito) {
          this.gestion = res.objeto;
          this.formGestion.controls.codArea.setValue(this.gestion.codArea);
          this.formGestion.controls.nombre.setValue(this.gestion.nombre);
          this.formGestion.controls.desde.setValue(this.gestion.desde);
          this.formGestion.controls.hasta.setValue(this.gestion.hasta);
          if (this.gestion.etapas.length > 0) {
            this.$etapas = this.gestion.etapas;
          }
        }
      }
    );
  }

  get getEtapas(): any[] {
    if (this.gestiones.length == 0) {
      return [];
    }
    const items = this.gestiones.find(i => i.codGestion == this.gestion.codGestion);
    return items ? items.etapas : [];
  }

  addEtapa() {
    if (isNullOrUndefined(this.formGestion.controls.desdeTemp.value) || isNullOrUndefined(this.formGestion.controls.hastaTemp.value)) {
      return;
    }

    if (this.etapaEdit) {
      const index = this.$etapas.findIndex(i => i.codEtapa == this.etapaEdit.codEtapa);
      if (index >= 0) {
        this.$etapas[index].nombre = this.formGestion.controls.codEtapaTemp.value;
        this.$etapas[index].desde = this.formGestion.controls.desdeTemp.value;
        this.$etapas[index].hasta = this.formGestion.controls.hastaTemp.value;
        this.$etapas[index].codigo = FUNC.slugGenerate(this.formGestion.controls.codEtapaTemp.value);
        this.$etapas = this.$etapas.sort((a, b) => (a.desde > b.desde) ? 1 : ((b.desde > a.desde) ? -1 : 0));
        this.formGestion.controls.codEtapaTemp.setValue('');
        this.formGestion.controls.desdeTemp.setValue('');
        this.formGestion.controls.hastaTemp.setValue('');
        this.toastr.success('Etapa actualizada correctamente.');
      }
      this.etapaEdit = undefined;
    } else {
      const index = this.$etapas.findIndex(i => i.nombre == this.formGestion.controls.codEtapaTemp.value);
      if (index >= 0) {
        this.toastr.warning('El nombre de la etapa ya existe.');
      } else {
        this.$etapas.push({
          codEtapa: null,
          codGestion: this.gestion.codGestion,
          nombre: this.formGestion.controls.codEtapaTemp.value,
          codigo: FUNC.slugGenerate(this.formGestion.controls.codEtapaTemp.value),
          color: null,
          desde: this.formGestion.controls.desdeTemp.value,
          estado: '1',
          hasta: this.formGestion.controls.hastaTemp.value,
          fechaActualizacion: null,
          fechaCreacion: null,
          userCreate: null,
          userUpdate: null
        });
        this.$etapas = this.$etapas.sort((a, b) => (a.desde > b.desde) ? 1 : ((b.desde > a.desde) ? -1 : 0));
        this.formGestion.controls.codEtapaTemp.setValue('');
        this.formGestion.controls.desdeTemp.setValue('');
        this.formGestion.controls.hastaTemp.setValue('');
      }
    }
  }

  estadoEtapa(etapa: any, estado: any) {
    if (etapa.codEtapa) {
      etapa.estado = estado;
    } else {
      this.$etapas = this.$etapas.filter(i => i.nombre != etapa.nombre);
    }
  }

  agregar() {
    if (this.$etapas.length == 0) {
      this.toastr.warning('Debe ingresar al menos una etapa');
      return;
    }
    const gestion = Object.assign({}, this.gestion);
    const etapas = this.$etapas;
    gestion.codArea = this.formGestion.controls.codArea.value;
    gestion.nombre = this.formGestion.controls.nombre.value;
    gestion.codGestion = this.gestion.codGestion;
    gestion.desde = Number(this.formGestion.controls.desde.value);
    gestion.hasta = Number(this.formGestion.controls.hasta.value);
    gestion.etapas = etapas;
    this.spinner.show();
    this.gestionService.actualizarGestion(gestion).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('', res.mensaje, 'success');
          this.router.navigateByUrl('/auth/configuracion/gestiones');
        } else {
          Swal.fire('', res.mensaje, 'warning');
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        Swal.fire('', 'Ocurrio un error en el proceso.', 'warning');
      }
    );
  }

  editarItem(item: any) {
    this.formGestion.controls.codEtapaTemp.setValue(item.nombre);
    this.formGestion.controls.desdeTemp.setValue(item.desde);
    this.formGestion.controls.hastaTemp.setValue(item.hasta);
    this.etapaEdit = item;
  }
}
