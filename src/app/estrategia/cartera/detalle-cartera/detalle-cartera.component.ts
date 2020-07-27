import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import Swal from 'sweetalert2';
import {isNullOrUndefined} from 'util';
import {Cartera} from '../../../interfaces/cartera';
import {FUNC} from '../../../comun/FUNC';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {GrupoCampo} from '../../../interfaces/grupo-campo';

export interface MultiSelect {
  id: string;
  name: string;
}

export interface Seleccionado {
  listaCampos?: string;
  valorFinal?: number;
  valorInicial?: number;
  selectedOptionsIds?: any[];
}

@Component({
  selector: 'app-detalle-cartera',
  templateUrl: './detalle-cartera.component.html',
  styleUrls: ['./detalle-cartera.component.css']
})
export class DetalleCarteraComponent implements OnInit {

  formulario: FormGroup;
  cartera: Cartera;
  gestiones: any[] = [];
  monedas: any[] = [];
  monedasSeleccionadas: any[] = [];

  tipoCreditos: MultiSelect[] = [];
  sedes: MultiSelect[] = [];

  formAdicional: FormGroup;
  itemsSelected: MultiSelect[] = [];
  placeholderSelect: '';
  number = false;

  constructor(
    private router: Router,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) {
    const state = this.router.getCurrentNavigation().extras.state;
    if (!isNullOrUndefined(state)) {
      this.cartera = state.cartera;
    } else {
      this.router.navigateByUrl('/auth/estrategia/carteras');
    }
  }

  ngOnInit() {
    this.listaTipoCreditos();
    this.listaSedes();
    this.listarMondas();
    // this.getCartera();
    this.formulario = this.formBuilder.group({
      codCartera: [''],
      codigo: [{value: '', disabled: true}],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      nombreExterno: [{value: '', disabled: true}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      diasDeudaSinVencer: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      horaInicio: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      horaFin: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      compromisoDesde: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      compromisoHasta: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      diasGestion: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      monedas: [],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}],
      campos: [],
      gestiones: []
    });
    this.formAdicional = this.formBuilder.group({
      listaCampos: ['', [Validators.required]],
      selectedOptionsIds: [],
      valorInicial: [''],
      valorFinal: [''],
    });
    if (this.cartera) {
      if (this.cartera.campos.length > 0) {
        const items = this.convertObject(this.cartera.campos);
        this.formAdicional.controls.listaCampos.setValue(items.listaCampos);
        if (items.selectedOptionsIds.length > 0) {
          this.cargarItems(items.listaCampos);
          this.formAdicional.controls.selectedOptionsIds.setValue(items.selectedOptionsIds);
        } else {
          this.formAdicional.controls.valorInicial.setValue(items.valorInicial);
          this.formAdicional.controls.valorFinal.setValue(items.valorFinal);
          this.formAdicional.controls.selectedOptionsIds.setValue([]);
          this.number = true;
        }
      }
      this.formulario.setValue(this.cartera);
      this.formulario.controls.fechaCreacion.setValue(FUNC.formatDate(this.cartera.fechaCreacion, 'd MMMM yy h:mm a'));
      this.formulario.controls.fechaActualizacion.setValue(FUNC.formatDate(this.cartera.fechaActualizacion, 'd MMMM yy h:mm a'));
      if (this.cartera.monedas.length > 0) {
        this.cartera.monedas.forEach(e => {
          this.monedasSeleccionadas.push({
            codTabla: null,
            codItem: e.codMoneda,
            descripcion: null,
            strValor: null,
            intValor: null,
            codEstado: null,
          });
        });
      }
    }
    this.getGestiones();
  }

  listarMondas() {
    this.maestroService.listarMondas().subscribe(
      response => {
        this.monedas = response;
      }
    );
  }

  getCartera() {
    this.carteraService.carteraAbaco().subscribe(
      response => {
        if (response.exito) {
          this.cartera = response.objeto;
          this.formulario.setValue(this.cartera);
          if (this.cartera.monedas.length > 0) {
            this.cartera.monedas.forEach(e => {
              this.monedasSeleccionadas.push({
                codTabla: null,
                codItem: e.codMoneda,
                descripcion: null,
                strValor: null,
                intValor: null,
                codEstado: null,
              });
            });
          }
        }
      }
    );
  }

  getGestiones() {
    this.spinner.show();
    this.carteraService.getGestiones(String(this.cartera.codCartera)).subscribe(
      response => {
        if (response.exito) {
          this.gestiones = response.objeto;
        }
        this.spinner.hide();
      }
    );
  }

  guardar() {

    if (this.formulario.invalid || this.formAdicional.invalid) {
      Swal.fire('Cartera', 'Debe ingresar los datos necesario.', 'error');
      return;
    }

    if (this.monedasSeleccionadas.length == 0) {
      Swal.fire('Cartera', 'Debe seleccionar un tipo de monesa.', 'error');
      return;
    }
    const data = this.formulario.getRawValue();
    const obj = this.formAdicional.getRawValue();
    data.monedas = this.convert();
    data.fechaCreacion = this.cartera.fechaCreacion;
    data.fechaActualizacion = this.cartera.fechaActualizacion;
    data.campos = this.reverseConvertObject(obj);
    this.spinner.show();
    this.carteraService.actualizarCartera(data).subscribe(
      response => {
        if (response.exito) {
          this.getCartera();
          Swal.fire('Actualizar Cartera', 'Se actualizó la cartera correctamente.', 'success');
        } else {
          this.toastr.error('Ocurrio un error.', 'Actualizar Cartera');
        }
        this.spinner.hide();
      }
    );
  }

  convert() {
    const array = [];
    if (this.monedasSeleccionadas.length > 0) {
      this.monedasSeleccionadas.forEach(e => {
        array.push({
          codCartera: this.cartera.codCartera,
          codMoneda: e.codItem
        });
      });
    }
    return array;
  }

  cambioMoneda(event: any, item: any) {
    const index = this.monedasSeleccionadas.findIndex(v => v.codItem == item.codItem);

    if (event.target.checked) {
      if (index == -1) {
        this.monedasSeleccionadas.push(item);
      }
    } else {
      console.log(index);
      if (index >= 0) {
        this.monedasSeleccionadas.splice(index, 1);
      }
    }
    console.log(this.monedasSeleccionadas);
  }

  selecciodano(item: any) {
    const obj = this.monedasSeleccionadas.find(v => v.codItem == item.codItem);
    return !!obj;
  }

  cambio(tipo: any) {
    if (tipo == '1') {
      $('.gestion').removeClass('active');
      $('.cartera').addClass('active');
      $('#gestion').removeClass('show active');
      $('#cartera').addClass('show active');
    } else {
      $('.cartera').removeClass('active');
      $('.gestion').addClass('active');
      $('#gestion').addClass('show active');
      $('#cartera').removeClass('show active');
    }
  }

  public listaTipoCreditos() {
    this.maestroService.listaTipoCreditos().subscribe(
      res => res.forEach(item => this.tipoCreditos.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  public listaSedes() {
    this.maestroService.listaSedes().subscribe(
      res => res.forEach(item => this.sedes.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  seleccionarTipo(event: any) {
    this.number = false;
    this.itemsSelected = [];
    this.formAdicional.controls.selectedOptionsIds.setValue([]);
    this.formAdicional.controls.valorInicial.setValue('');
    this.formAdicional.controls.valorFinal.setValue('');
    this.formAdicional.get('selectedOptionsIds').setValidators([]);
    this.formAdicional.get('selectedOptionsIds').updateValueAndValidity();
    this.formAdicional.get('valorInicial').setValidators([]);
    this.formAdicional.get('valorInicial').updateValueAndValidity();
    this.formAdicional.get('listaCampos').setValidators([]);
    this.formAdicional.get('listaCampos').updateValueAndValidity();

    this.placeholderSelect = event.target.options[event.target.options.selectedIndex].text;

    switch (event.target.value) {
      case '001' :
        this.itemsSelected = this.tipoCreditos;
        this.formAdicional.get('selectedOptionsIds').setValidators([Validators.required]);
        this.formAdicional.get('selectedOptionsIds').updateValueAndValidity();
        break;
      case '002' :
        this.itemsSelected = this.sedes;
        this.formAdicional.get('selectedOptionsIds').setValidators([Validators.required]);
        this.formAdicional.get('selectedOptionsIds').updateValueAndValidity();
        break;
      case '003' :
        this.number = true;
        this.formAdicional.get('valorInicial').setValidators([Validators.required]);
        this.formAdicional.get('valorInicial').updateValueAndValidity();
        break;
      default:
        this.itemsSelected = [];
        this.number = false;
        this.formAdicional.controls.selectedOptionsIds.setValue([]);
        this.formAdicional.get('listaCampos').setValidators([Validators.required]);
        this.formAdicional.get('listaCampos').updateValueAndValidity();
    }
  }

  cargarItems(event: any) {
    this.number = false;
    switch (event) {
      case '001' :
        this.itemsSelected = this.tipoCreditos;
        break;
      case '002' :
        this.itemsSelected = this.sedes;
        break;
      case '003' :
        this.number = true;
        break;
    }
  }

  convertObject(items: GrupoCampo[]) {
    const seleced: Seleccionado = {};
    seleced.selectedOptionsIds = [];
    if (items.length == 1) {
      items.forEach(v => {
        seleced.listaCampos = v.codCampo;
        seleced.valorInicial = v.desde;
        seleced.valorFinal = v.hasta;
      });
    } else {
      items.forEach(v => {
        seleced.listaCampos = v.codCampo;
        seleced.selectedOptionsIds.push(v.valor);
      });
    }
    return seleced;
  }

  reverseConvertObject(seleccionado: Seleccionado) {
    const items: GrupoCampo[] = [];
    if (seleccionado.selectedOptionsIds.length > 0) {

      seleccionado.selectedOptionsIds.forEach(v => {
        items.push({
          codCartera: this.cartera.codCartera,
          codCampo: seleccionado.listaCampos,
          valor: v,
          desde: null,
          hasta: null,
          codGrupCampo: null
        });
      });
    } else {
      items.push({
        codCartera: this.cartera.codCartera,
        codCampo: seleccionado.listaCampos,
        desde: seleccionado.valorInicial,
        hasta: seleccionado.valorFinal,
        codGrupCampo: null,
        valor: null
      });
    }

    return items;
  }
}

