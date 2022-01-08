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
        Swal.fire('Crear Gestión', 'La cantidad del campo desde no es valido.', 'error');
        this.formGestion.controls.desde.setValue(0);
        return;
      }
    }
  }

  validarHasta() {
    const hasta = Number(this.formGestion.controls.hasta.value);
    const desde = Number(this.formGestion.controls.desde.value);
    if (hasta <= desde) {
      Swal.fire('Crear Gestión', 'La cantidad del campo hasta no es valido.', 'error');
      this.formGestion.controls.hasta.setValue(0);
      return;
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
    if (isNullOrUndefined(this.formGestion.controls.desdeTemp.value) || isNullOrUndefined(this.formGestion.controls.hastaTemp.value)) {
      return;
    }
    const index = this.$etapas.findIndex(i => i.nombre == this.formGestion.controls.codEtapaTemp.value);
    if (index >= 0) {
      this.toastr.warning('El nombre de la etapa ya existe.');
    } else {
      this.$etapas.push({
        codEtapa: null,
        codGestion: null,
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

  estadoEtapa(etapa: any, estado: any) {
    this.$etapas = this.$etapas.filter(i => i.nombre != etapa.nombre);
  }

  agregar() {
    if (this.formGestion.invalid) {
      this.toastr.warning('Debe ingresar los datos obligatorios.');
      return;
    }
    if (this.$etapas.length == 0) {
      this.toastr.warning('Debe ingresar al menos una etapa');
      return;
    }
    const etapas = this.$etapas;
    const gestion = {
      codArea: this.formGestion.controls.codArea.value,
      nombre: this.formGestion.controls.nombre.value,
      desde: Number(this.formGestion.controls.desde.value),
      hasta: Number(this.formGestion.controls.hasta.value),
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

}
