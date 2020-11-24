import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {Cartera} from '../../../interfaces/cartera';
import {isNullOrUndefined} from 'util';
import {FUNC} from '../../../comun/FUNC';
import {GrupoCampo} from '../../../interfaces/grupo-campo';
import {MultiSelect, Seleccionado} from '../detalle-cartera/detalle-cartera.component';
import {CONST} from '../../../comun/CONST';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';

declare var $: any;


@Component({
  selector: 'app-crear-cartera',
  templateUrl: './crear-cartera.component.html',
  styleUrls: ['./crear-cartera.component.css']
})
export class CrearCarteraComponent implements OnInit {
  formulario: FormGroup;
  formAdicional: FormGroup;
  monedas: any[] = [];
  monedasSeleccionadas: any[] = [];

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

  constructor(
    private router: Router,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) {
  }

  ngOnInit() {
    this.listarTipoProductos();
    this.listarTipoBancas();
    this.listarTipoDivisiones();
    this.listarTipoComerciales();
    this.listarTipoSocios();
    this.listarClasificacionDeudor();
    this.listaTipoCreditos();
    this.listaSedes();
    this.listarMondas();

    this.formulario = this.formBuilder.group({
      codCartera: [''],
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
      estado: [{value: '', disabled: true}]
    });

    this.formAdicional = this.formBuilder.group({
      listaCampos: ['', [Validators.required]],
      selectedOptionsIds: [],
      valorInicial: [''],
      valorFinal: [''],
    });
  }

  listarMondas() {
    this.spinner.show();
    this.maestroService.listarMondas().subscribe(
      res => {
        this.monedas = res;
        this.spinner.hide();
      },
      err => {
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
    data.monedas = this.convert();
    data.nombreExterno = FUNC.generateSlug(data.nombre);
    const obj = this.formAdicional.getRawValue();
    data.campos = this.reverseConvertObject(obj);
    this.spinner.show();
    this.carteraService.crearCartera(data).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Crear Cartera', 'Se registro la cartera correctamente.', 'success');
          const cart: Cartera = res.objeto as Cartera;
          this.router.navigate(['/auth/estrategia/carteras/crear-gestion'], {state: {create: true, cartera: cart, gestiones: []}});
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
          codCartera: null,
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
  }

  selecciodano(item: any) {
    const obj = this.monedasSeleccionadas.find(v => v.codItem == item.codItem);
    return !!obj;
  }

  generateCode(event: any) {
    const value = event.target.value;
    this.formulario.controls.nombreExterno.setValue(FUNC.generateSlug(value));
  }

  public listaTipoCreditos() {
    this.maestroService.listaTablaTipoCredito().subscribe(
      res => res.forEach(item => this.tipoCreditos.push({id: item.codItem, name: item.descripcion}))
      ,
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

  reverseConvertObject(seleccionado: Seleccionado) {
    const items: GrupoCampo[] = [];
    if (seleccionado.selectedOptionsIds.length > 0) {

      seleccionado.selectedOptionsIds.forEach(v => {
        items.push({
          codCartera: null,
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
        codCartera: null,
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
}
