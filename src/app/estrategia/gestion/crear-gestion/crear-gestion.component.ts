import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {GestionService} from '../../../servicios/estrategia/gestion.service';
import {isNullOrUndefined} from 'util';
import Swal from 'sweetalert2';
import {CONST} from '../../../comun/CONST';
import {FUNC} from '../../../comun/FUNC';
import {Gestion} from '../../../interfaces/cartera';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {Autorizacion} from '../../../comun/autorzacion';

@Component({
  selector: 'app-crear-gestion',
  templateUrl: './crear-gestion.component.html',
  styleUrls: ['./crear-gestion.component.css']
})
export class CrearGestionComponent implements OnInit {
  formGestion: FormGroup;
  etapas: any[] = [];
  gestiones: any[] = [];
  areas: TablaMaestra[] = [];
  personaCreate: any;
  personaUpdate: any;
  $etapas: any[] = [];
  $gestiones: Gestion[] = [];
  A = Autorizacion;

  constructor(
    private formBuilder: FormBuilder,
    private carteraService: CarteraService,
    public modalService: NgbModal,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private maestroService: MaestroService,
    private gestionService: GestionService,
    public menuService: MenuService
  ) {

  }

  ngOnInit() {
    if (this.menuService.hasShowEtapa(this.A.ETAPA_LISTA)) {
      this.listarGestiones();
      this.loadAreas();
    }

    this.formGestion = this.formBuilder.group({
      codArea: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      desde: [''],
      hasta: [''],
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

  validarDesde() {
    this.formGestion.controls.hasta.setValue(0);
    const desde = Number(this.formGestion.controls.desde.value);
    if (this.gestiones.length > 0) {
      let flag = true;
      this.gestiones.forEach(v => {
        if (desde <= v.hasta) {
          flag = false;
        }
      });
      if (!flag) {
        Swal.fire('Crear Etapa', 'La cantidad del campo desde no es valido.', 'error');
        this.formGestion.controls.desde.setValue(0);
        return;
      }
    }
  }

  validarHasta() {
    const hasta = Number(this.formGestion.controls.hasta.value);
    const desde = Number(this.formGestion.controls.desde.value);
    if (hasta <= desde) {
      Swal.fire('Crear Etapa', 'La cantidad del campo hasta no es valido.', 'error');
      this.formGestion.controls.hasta.setValue(0);
      return;
    }
    if (this.$etapas.length == 0) {
      this.desdeTemp.setValue(desde);
      this.desdeTemp.disable();
      this.hastaTemp.setValue(desde + 1);
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


  addEtapa() {
    if (this.codEtapaTemp.value.length == 0) {
      this.toastr.warning('Debe ingresar un nombre de la subetapa.');
      return;
    }
    /*
    if (isNullOrUndefined(this.formGestion.controls.desdeTemp.value) || isNullOrUndefined(this.formGestion.controls.hastaTemp.value)) {
      this.toastr.warning('Debe ingresar el intervalo de días de la subetapa.');
      return;
    }

    if (this.codEtapaTemp.value.length == 0) {
      this.toastr.warning('Debe ingresar un nombre de la subetapa.');
      return;
    }

    const ultimo = Number(this.hasta.value);
    const ultimoTemp = Number(this.desdeTemp.value);
    if (ultimoTemp > ultimo) {
      Swal.fire('', 'La cantidad no es valida.', 'warning');
      this.hastaTemp.setValue(ultimo);
      return;
    }

    if (this.$etapas.length > 0) {
      const last = this.$etapas[this.$etapas.length - 1];
      if (Number(last.hasta) == ultimoTemp) {
        Swal.fire('', 'No hay días disponibles', 'warning');
        this.hastaTemp.setValue(ultimo);
        this.hastaTemp.disable();
        return;
      }
    }
    */
    const index = this.$etapas.findIndex(i => i.nombre == this.formGestion.controls.codEtapaTemp.value);
    if (index >= 0) {
      this.toastr.warning('El nombre de la subetapa ya existe.');
    } else {
      this.$etapas.push({
        codEtapa: null,
        codGestion: null,
        nombre: this.formGestion.controls.codEtapaTemp.value,
        codigo: FUNC.slugGenerate(this.formGestion.controls.codEtapaTemp.value),
        color: null,
        desde: 0,
        estado: '1',
        hasta: 0,
        fechaActualizacion: null,
        fechaCreacion: null,
        userCreate: null,
        userUpdate: null
      });
     // this.$etapas = this.$etapas.sort((a, b) => (a.desde > b.desde) ? 1 : ((b.desde > a.desde) ? -1 : 0));
      this.formGestion.controls.codEtapaTemp.setValue('');
      this.desdeTemp.setValue('');
      this.desdeTemp.enable();
      // this.formGestion.controls.hastaTemp.setValue('');
      this.disbleCampoHasta();
      // this.calcularValoresTemp();
    }
  }

  removeEtapa(etapa: any, index: any) {
    const lastIndex = this.$etapas.length - 1;
    if (index == lastIndex) {
      this.$etapas.splice(index, 1);
      this.hastaTemp.enable();
      this.disbleCampoHasta();
      // this.calcularValoresTemp();
    } else {
      Swal.fire('', 'Debe eliminar el ultimo de la lista.', 'warning');
    }
  }

  agregar() {
    if (this.formGestion.invalid) {
      this.toastr.warning('Debe ingresar los datos obligatorios.');
      return;
    }
    if (this.$etapas.length == 0) {
      this.toastr.warning('Debe ingresar al menos una subetapa');
      return;
    }
    const etapas = this.$etapas;
    // const ultima = this.$etapas[this.$etapas.length - 1];
    // if (Number(ultima.hasta) < Number(this.hasta.value)) {
    //   Swal.fire('', `Debe ocupar todos los días disponible de la etapa [${this.desde.value} - ${this.hasta.value}], se quedo en : ${ultima.hasta}.`, 'warning');
    //   return;
    // }

    const gestion = {
      codArea: this.formGestion.controls.codArea.value,
      nombre: this.formGestion.controls.nombre.value,
      desde: 0,
      hasta: 0,
      etapas,
    };

    this.spinner.show();
    this.gestionService.crearGestion(gestion).subscribe(
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

  listarGestiones() {
    this.gestionService.listar().subscribe(
      res => {
        if (res.exito) {
          this.$gestiones = res.objeto as any[];
          // if (this.$gestiones.length > 0) {
          //   const ultima = this.$gestiones[this.$gestiones.length - 1];
          //   if (ultima) {
          //     this.desde.setValue(Number(ultima.hasta) + 1);
          //     this.desde.disable();
          //   }
          // }
        }
      },
      err => {
      }
    );
  }

  get desde() {
    return this.formGestion.controls.desde;
  }

  get hasta() {
    return this.formGestion.controls.hasta;
  }

  get desdeTemp() {
    return this.formGestion.controls.desdeTemp;
  }

  get hastaTemp() {
    return this.formGestion.controls.hastaTemp;
  }

  get codEtapaTemp() {
    return this.formGestion.controls.codEtapaTemp;
  }

  disbleCampoHasta() {
    if (this.$etapas.length > 0) {
      this.hasta.disable();
    } else {
      this.hasta.enable();
    }
  }

  validarHastaTemp() {
    const hasta = Number(this.hastaTemp.value);
    const desde = Number(this.desdeTemp.value);
    if (hasta > this.hasta.value) {
      Swal.fire('', 'La cantidad no debe superar a ' + this.hasta.value, 'warning');
      this.hastaTemp.setValue(desde + 1);
      return;
    }

    if (hasta <= desde) {
      Swal.fire('Crear sub-Etapa', 'La cantidad del campo hasta no es valido.', 'error');
      this.hastaTemp.setValue(desde + 1);
      return;
    }
  }

  calcularValoresTemp() {
    if (this.$etapas.length == 0) {
      this.desdeTemp.setValue(Number(this.desde.value));
      this.hastaTemp.setValue(Number(this.desde.value) + 1);
      this.desdeTemp.disable();
    } else {
      const ultimo = this.$etapas[this.$etapas.length - 1];
      const desde = Number(ultimo.hasta) + 1;
      const hasta = Number(ultimo.hasta) + 2;
      if (desde <= Number(this.hasta.value)) {
        this.desdeTemp.setValue(desde);
        this.desdeTemp.disable();
        if (hasta > Number(this.hasta.value)) {
          this.hastaTemp.setValue(this.hasta.value);
        } else {
          this.hastaTemp.setValue(hasta);
        }
      } else {
        this.desdeTemp.setValue(Number(this.hasta.value));
        this.hastaTemp.setValue(Number(this.hasta.value));
        this.desdeTemp.disable();
        this.hastaTemp.disable();
      }
    }
  }

  isDisable() {
    return !!isNullOrUndefined(this.codEtapaTemp.value);

  }
}
