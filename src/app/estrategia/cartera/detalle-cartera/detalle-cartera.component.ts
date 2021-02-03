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
import {CONST} from '../../../comun/CONST';

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
  formAdicional: FormGroup;
  placeholderSelect: '';
  number = false;
  mgsError: any;

  itemsSelected: MultiSelect[] = [];
  tipoProductos: MultiSelect[] = [];
  tipoBancas: MultiSelect[] = [];
  tipoDiviciones: MultiSelect[] = [];
  tipoCreditos: MultiSelect[] = [];
  tipoComercios: MultiSelect[] = [];
  tipoSocios: MultiSelect[] = [];
  tipoCalificacionesDeudor: MultiSelect[] = [];
  sedes: MultiSelect[] = [];
  codCartera: any;

  listaGrupos: TablaMaestra[] = [
    {
      codItem: CONST.TABLE_STR_LISTA_PRODUCTO_ABACO,
      descripcion: 'PRODUCTO',
    },
    {
      codItem: CONST.TABLE_STR_LISTA_BANCA_ABACO,
      descripcion: 'BANCA',
    },
    {
      codItem: CONST.TABLE_STR_TIPO_DIVISION_ABACO,
      descripcion: 'DIVISIÓN',
    },
    {
      codItem: CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO,
      descripcion: 'TIPO DE CRÉDITO SBS',
    },
    {
      codItem: CONST.TABLE_STR_TIPO_COMERCIAL_ABACO,
      descripcion: 'TIPO COMERCIO',
    },
    {
      codItem: CONST.TABLE_STR_TIPO_DE_SOCIO_ABACO,
      descripcion: 'TIPO DE SOCIO',
    },
    {
      codItem: CONST.TABLE_STR_CLASIFICACION_DEL_DEUDOR_ABACO,
      descripcion: 'CLASIFICACION DEL DEUDOR',
    },
    {
      codItem: CONST.TABLE_INT_MONTO,
      descripcion: 'MONTO DE SALDO DEUDA',
    },
    {
      codItem: CONST.TABLE_STR_LISTA_SEDE,
      descripcion: 'DISTRITO',
    }
  ];
  areas: TablaMaestra[] = [];

  constructor(
    public router: Router,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) {
    const state = this.router.getCurrentNavigation().extras.state;
    if (!isNullOrUndefined(state)) {
      // this.cartera = state.cartera;
      this.codCartera = state.cartera.codCartera;
    } else {
      this.router.navigateByUrl('/auth/estrategia/carteras');
    }
  }

  ngOnInit() {
    this.loadAreas();
    this.listarTipoProductos();
    this.listarTipoBancas();
    this.listarTipoDivisiones();
    this.listarTipoComerciales();
    this.listarTipoSocios();
    this.listarClasificacionDeudor();
    this.listaTipoCreditos();
    this.listaSedes();
    this.listarMondas();
    if (this.codCartera) {
      this.loadCartera(this.codCartera);
    }
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
      carteraGestions: [],
      gestiones: [],
    });
    this.formAdicional = this.formBuilder.group({
      listaCampos: ['', [Validators.required]],
      selectedOptionsIds: [],
      valorInicial: [''],
      valorFinal: [''],
    });
    // this.getGestiones();
  }

  listarMondas() {
    this.maestroService.listarMondas().subscribe(
      response => {
        this.monedas = response;
        if (!this.codCartera) {
          this.spinner.hide();
        }
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  getCartera() {
    this.carteraService.carteraAbaco().subscribe(
      response => {
        if (response.exito) {
          this.cartera = response.objeto;
          const data = this.cartera;
          data.gestiones = [];
          this.formulario.setValue(data);
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

  listarGestiones() {
    this.spinner.show();
    this.carteraService.getGestiones('2').subscribe(
      response => {
        if (response.exito) {
          this.gestiones = response.objeto;
          console.log(response.objeto);
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
    data.userCreate = this.cartera.userCreate;
    data.userUpdate = this.cartera.userUpdate;
    data.campos = this.reverseConvertObject(obj);
    this.spinner.show();
    this.carteraService.actualizarCartera(data).subscribe(
      response => {
        if (response.exito) {
          this.loadCartera(this.cartera.codCartera);
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
    this.maestroService.listaTablaTipoCredito().subscribe(
      res => res.forEach(item => this.tipoCreditos.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  public listaSedes() {
    this.maestroService.listaTablaSedes().subscribe(
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
      case CONST.TABLE_STR_LISTA_PRODUCTO_ABACO :
        this.agregarItemsAlGrupo(this.tipoProductos);
        break;
      case CONST.TABLE_STR_LISTA_BANCA_ABACO :
        this.agregarItemsAlGrupo(this.tipoBancas);
        break;
      case CONST.TABLE_STR_TIPO_DIVISION_ABACO :
        this.agregarItemsAlGrupo(this.tipoDiviciones);
        break;
      case CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO :
        this.agregarItemsAlGrupo(this.tipoCreditos);
        break;
      case CONST.TABLE_STR_TIPO_COMERCIAL_ABACO :
        this.agregarItemsAlGrupo(this.tipoComercios);
        break;
      case CONST.TABLE_STR_TIPO_DE_SOCIO_ABACO :
        this.agregarItemsAlGrupo(this.tipoSocios);
        break;
      case CONST.TABLE_STR_CLASIFICACION_DEL_DEUDOR_ABACO :
        this.agregarItemsAlGrupo(this.tipoCalificacionesDeudor);
        break;
      case  CONST.TABLE_STR_LISTA_SEDE:
        this.agregarItemsAlGrupo(this.sedes);
        break;
      case  CONST.TABLE_INT_MONTO :
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

  agregarItemsAlGrupo(items: any[]) {
    this.itemsSelected = items;
    this.formAdicional.get('selectedOptionsIds').setValidators([Validators.required]);
    this.formAdicional.get('selectedOptionsIds').updateValueAndValidity();
  }

  cargarItems(event: any) {
    this.number = false;
    switch (event) {
      case CONST.TABLE_STR_LISTA_BANCA_ABACO :
        this.itemsSelected = this.tipoBancas;
        break;
      case CONST.TABLE_STR_TIPO_DIVISION_ABACO :
        this.itemsSelected = this.tipoDiviciones;
        break;
      case CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO :
        this.itemsSelected = this.tipoCreditos;
        break;
      case CONST.TABLE_STR_TIPO_COMERCIAL_ABACO :
        this.itemsSelected = this.tipoComercios;
        break;
      case CONST.TABLE_STR_TIPO_DE_SOCIO_ABACO :
        this.itemsSelected = this.tipoSocios;
        break;
      case CONST.TABLE_STR_CLASIFICACION_DEL_DEUDOR_ABACO :
        this.itemsSelected = this.tipoCalificacionesDeudor;
        break;
      case CONST.TABLE_STR_LISTA_PRODUCTO_ABACO :
        this.itemsSelected = this.tipoCreditos;
        break;
      case CONST.TABLE_STR_LISTA_SEDE :
        this.itemsSelected = this.sedes;
        break;
      case CONST.TABLE_INT_MONTO :
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
          codGrupCampo: null,
          descripcion: null
        });
      });
    } else {
      items.push({
        codCartera: this.cartera.codCartera,
        codCampo: seleccionado.listaCampos,
        desde: seleccionado.valorInicial,
        hasta: seleccionado.valorFinal,
        codGrupCampo: null,
        valor: null,
        descripcion: null
      });
    }

    return items;
  }

  changeInitHour(init: number, input: any) {
    const end = Number(input.value || 0);
    init = Number(init);
    if (init < 0 || init > 24) {
      this.formulario.controls.horaInicio.setErrors({incorrect: true});
      this.mgsError = 'La hora de inicio no es una hora válida.';
    }

    if (end > 0 && init > end) {
      this.formulario.controls.horaInicio.setErrors({incorrect: true});
      this.mgsError = 'La hora de inicio no puede ser mayor a la hora fin.';
    }

    if (init == end) {
      this.formulario.controls.horaInicio.setErrors({incorrect: true});
      this.mgsError = 'La hora de inicio no puede ser igual a la hora fin.';
    }
  }

  changeEndHour(end: number, input: any) {
    const init = Number(input.value || 0);
    end = Number(end);

    if (end < 0 || end > 24) {
      this.formulario.controls.horaFin.setErrors({incorrect: true});
      this.mgsError = 'La hora fin no es una hora válida.';
    }
    if (init > 0 && end < init) {
      this.formulario.controls.horaFin.setErrors({incorrect: true});
      this.mgsError = 'La hora fin no puede ser menor a la hora de inicio.';
    }

    if (init == end) {
      this.formulario.controls.horaFin.setErrors({incorrect: true});
      this.mgsError = 'La hora fin no puede ser igual a la hora inicio.';
    }
  }

  changeDesde(init: number, input: any) {
    const end = Number(input.value || 0);
    init = Number(init);

    if (end > 0 && init > end) {
      this.formulario.controls.compromisoDesde.setErrors({incorrect: true});
      this.mgsError = 'La campo desde no puede ser mayor al campo hasta.';
    }

    if (init == end) {
      this.formulario.controls.compromisoDesde.setErrors({incorrect: true});
      this.mgsError = 'La campo desde no puede ser igual al campo hasta';
    }
  }

  changeHasta(end: any, input: HTMLInputElement) {
    const init = Number(input.value || 0);
    end = Number(end);

    if (init > 0 && end < init) {
      this.formulario.controls.compromisoHasta.setErrors({incorrect: true});
      this.mgsError = 'La campo hasta no puede ser mayor al campo desde';
    }

    if (init == end) {
      this.formulario.controls.compromisoHasta.setErrors({incorrect: true});
      this.mgsError = 'La campo hasta no puede ser igual al campo desde';
    }
  }

  private listarTipoProductos() {
    this.maestroService.listaTablaProductoAbaco().subscribe(
      res => res.forEach(item => this.tipoProductos.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  private listarTipoBancas() {
    this.maestroService.listaTablaBancasAbaco().subscribe(
      res => res.forEach(item => this.tipoBancas.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  private listarTipoDivisiones() {
    this.maestroService.listaTablaDivisionesAbaco().subscribe(
      res => res.forEach(item => this.tipoDiviciones.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  private listarTipoComerciales() {
    this.maestroService.listaTablaComerciosAbaco().subscribe(
      res => res.forEach(item => this.tipoComercios.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  private listarTipoSocios() {
    this.maestroService.listaTablaTipoSociosAbaco().subscribe(
      res => res.forEach(item => this.tipoSocios.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  private listarClasificacionDeudor() {
    this.maestroService.listaTablaClasificacionDeudorAbaco().subscribe(
      res => res.forEach(item => this.tipoCalificacionesDeudor.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  loadAreas() {
    this.spinner.show();
    this.maestroService.listaTablaAreas().subscribe(
      res => {
        this.areas = res;
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  nameArea(id: string) {
    if (this.areas.length == 0) {
      return;
    }
    const area = this.areas.find(i => i.codItem == id);
    return area ? area.descripcion : '';
  }

  private loadCartera(codCartera: any) {
    this.carteraService.getCarteraByCodCartera(codCartera).subscribe(
      res => {
        if (res.exito) {
          this.cartera = res.cartera;
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
          this.formulario.controls.userCreate.setValue(res.personaCreate ? res.personaCreate.alias : '');
          this.formulario.controls.userUpdate.setValue(res.personaUpdate ? res.personaUpdate.alias : '');
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
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  generateCode(event: any) {
    const value = event.target.value;
    this.formulario.controls.nombreExterno.setValue(FUNC.generateSlug(value));
  }
}

