import {Component, OnInit, ViewChild} from '@angular/core';
import {Cartera, Etapa, Gestion} from '../../../interfaces/cartera';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MultiSelect} from '../../cartera/detalle-cartera/detalle-cartera.component';
import {NgWizardConfig, NgWizardService, StepChangedArgs, THEME} from 'ng-wizard';
import Swal from 'sweetalert2';
import {CONST} from '../../../comun/CONST';
import {EjecutivoCartera, EjecutivoCarteraCampo, EjecutivoCarteraEtapa} from '../../../models/ejecutivo-cartera';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {delay} from 'rxjs/operators';
import {SocioCredito} from '../../../interfaces/socio-credito';
import * as moment from 'moment';
import {GrupoCampo} from '../../../interfaces/grupo-campo';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';

declare const $: any;

@Component({
  selector: 'app-asignar-etapas-ejecutivo',
  templateUrl: './asignar-etapas-ejecutivo.component.html',
  styleUrls: ['./asignar-etapas-ejecutivo.component.css']
})
export class AsignarEtapasEjecutivoComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  carteras: Cartera[] = [];
  nombre: string;
  items: TreeviewItem[];
  gestiones: Gestion[] = [];
  etapas: Etapa[] = [];

  errors: string[] = [];

  tipoProductos: MultiSelect[] = [];
  tipoBancas: MultiSelect[] = [];
  tipoDiviciones: MultiSelect[] = [];
  tipoComercios: MultiSelect[] = [];
  tipoSocios: MultiSelect[] = [];
  tipoCalificacionesDeudor: MultiSelect[] = [];
  tipoCreditos: MultiSelect[] = [];
  sedes: MultiSelect[] = [];

  /**********/
  ejecutivoSelected: any;
  carteraSelected: Cartera;
  gestionSelected: Gestion;
  etapasSelecionadas: Etapa[] = [];
  desde: any;
  hasta: any;

  selectedProductos: any[] = [];
  selectedBancas: any[] = [];
  selectedDivisiones: any[] = [];
  selectedComercios: any[] = [];
  selectedSocios: any[] = [];
  selectedClasificacionDeudor: any[] = [];
  selectedSedes: any[] = [];
  selectedTipoCreditos: any[] = [];
  /**********/
  sociosSeleccionados: SocioCredito[] = [];

  sociosCredito: SocioCredito[] = [];

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.circles,
    toolbarSettings: {
      showNextButton: false,
      showPreviousButton: false,
      toolbarExtraButtons: [
        // {
        //   text: 'Finish',
        //   class: 'btn btn-info', event: () => {
        //     alert('Finished!!!');
        //   }
        // }
      ]
    }
  };

  showSedes = true;
  showTipoCredito = true;
  showMontos = true;
  errorMonto: string;
  album: any;
  socioModel: any;
  $creditos: any[] = [];
  $startDate: any;
  $endDate: any;
  $creditosCheched: any[] = [];
  nombreCampoTemp: any;
  frecuencia: any;
  showProductos = true;
  showBancas = true;
  showDivision = true;
  showComercios = true;
  showSocios = true;
  showClasificacionDeudor = true;
  $frec = '';

  constructor(
    public auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngWizardService: NgWizardService,
    private maestroService: MaestroService
  ) {
    activatedRoute.params.subscribe(({ejecutivoUuid}) => {
      if (ejecutivoUuid.length == 36) {
        this.buscarEjecutivoByCodUsuario(ejecutivoUuid);
      } else {
        this.buscarEjecutivoByCodUsuario(auth.loggedUser.uuid);
      }
    });
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
    this.listarTipoProductos();
    this.listarTipoBancas();
    this.listarTipoDivisiones();
    this.listarTipoComerciales();
    this.listarTipoSocios();
    this.listarClasificacionDeudor();
    this.listaTipoCreditos();
    this.listaSedes();
    this.listarCarteras();
  }

  frecuenciaCambio(event: any): void {
    this.$startDate = null;
    this.$endDate = null;
    this.frecuencia = null;
    if (event.length == 0) {
      return;
    }
    if (event == 'personalizado') {
      this.$startDate = moment().format('YYYY-MM-DD');
      this.$endDate = moment().add(1, 'month').format('YYYY-MM-DD');
      this.frecuencia = 'Personalizado';
      return;
    }
    moment.locale('es');
    const ranges = {
      diaria: {start: moment(), end: moment(), label: 'Diaria'},
      semana: {start: moment(), end: moment().add(6, 'days'), label: 'Semana'},
      quincenal: {start: moment(), end: moment().add(14, 'days'), label: 'Quincenal'},
      mensual: {start: moment(), end: moment().add(1, 'month'), label: 'Mensual'}
    };
    this.$startDate = ranges[event].start.format('YYYY-MM-DD');
    this.$endDate = ranges[event].end.format('YYYY-MM-DD');
    this.frecuencia = ranges[event].label;
  }

  buscarEjecutivoByCodUsuario(ejecutivoUuid) {
    this.asignacionService.buscarEjecutivoByCodUsuario(ejecutivoUuid).subscribe(
      res => {
        if (res.exito) {
          this.ejecutivoSelected = res.objeto;
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
          Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
        }
      },
      err => {
        console.log(err);
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
      }
    );
  }

  listarCarteras() {
    this.spinner.show();
    this.asignacionService.getCarteras().subscribe(
      res => {
        if (res.exito && res.objeto) {
          this.carteras = res.objeto as any[];
        } else {
          Swal.fire('Asignar', 'No se encontro la cartera o esta desactivada.', 'warning');
          this.router.navigateByUrl('/auth/estrategia/carteras');
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  public listaTipoCreditos() {
    this.asignacionService.listaTipoCreditos().subscribe(
      res => res.forEach(item => this.tipoCreditos.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  public listaSedes() {
    this.asignacionService.listaSedes().subscribe(
      res => res.forEach(item => this.sedes.push({id: item.codItem, name: item.descripcion})),
      err => console.log(err)
    );
  }

  showCarteras(ejecutivo: any, event?: Event) {
    this.ejecutivoSelected = ejecutivo;
    this.carteraSelected = null;
    this.gestionSelected = null;
    this.etapasSelecionadas = [];
    this.selectedSedes = [];
    this.selectedTipoCreditos = [];
    this.desde = null;
    this.hasta = null;
    this.frecuencia = null;
    this.gestiones = [];
    this.etapas = [];
    this.ngWizardService.next();
  }

  showGestion(cartera: Cartera, event?: Event) {
    this.showSedes = true;
    this.showTipoCredito = true;
    this.showMontos = true;
    this.gestionSelected = null;
    this.etapasSelecionadas = [];
    this.selectedSedes = [];
    this.selectedTipoCreditos = [];
    this.desde = null;
    this.hasta = null;
    this.frecuencia = null;
    this.etapas = [];
    this.sociosSeleccionados = [];
    this.$creditos = [];
    this.gestiones = cartera.gestiones;
    this.carteraSelected = cartera;
    this.$startDate = null;
    this.$endDate = null;
    this.$creditosCheched = [];
    $('#daterange-btn .text-title').html(` Seleccione rango `);

    if (cartera.campos[0].desde) {
      this.showMontos = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_STR_LISTA_PRODUCTO_ABACO) {
      this.showProductos = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_STR_LISTA_BANCA_ABACO) {
      this.showBancas = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_STR_TIPO_DIVISION_ABACO) {
      this.showDivision = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_STR_TIPO_COMERCIAL_ABACO) {
      this.showComercios = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_STR_TIPO_DE_SOCIO_ABACO) {
      this.showSocios = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_STR_CLASIFICACION_DEL_DEUDOR_ABACO) {
      this.showClasificacionDeudor = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_STR_LISTA_SEDE) {
      this.showSedes = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO) {
      this.showTipoCredito = false;
    }
    this.listarSociosByCartera(cartera.codCartera);
    this.ngWizardService.next();
  }

  showEtapa(gestion: Gestion, event?: Event) {
    this.etapasSelecionadas = [];
    this.selectedSedes = [];
    this.selectedTipoCreditos = [];
    this.desde = null;
    this.hasta = null;
    this.frecuencia = null;
    this.sociosSeleccionados = [];
    this.$creditos = [];
    this.$startDate = null;
    this.$endDate = null;
    $('#daterange-btn .text-title').html(` Seleccione rango `);
    this.$creditosCheched = [];
    this.etapas = gestion.etapas;
    this.gestionSelected = gestion;
    this.ngWizardService.next();
  }

  nextAdicionales() {
    this.sociosSeleccionados = [];
    this.$creditos = [];
    this.$creditosCheched = [];
    this.ngWizardService.next();
  }

  nextCoincidencias() {
    this.$creditos = [];
    const data = this.getData();
    this.spinner.show();
    this.asignacionService.buscarCreditosPorFiltro(data.cartera.codCartera, data).subscribe(
      res => {
        this.$creditos = res;
        this.ngWizardService.next();
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  stepChanged(args: StepChangedArgs) {
    // console.log(args);
  }


  checkSelected(event: any, item: Etapa) {
    this.etapasSelecionadas = [];
    this.etapasSelecionadas.push(item);
    /*
    const etapa = this.etapasSelecionadas.find(i => i.codEtapa == item.codEtapa);
    if (event.target.checked) {
      if (!etapa) {
        this.etapasSelecionadas.push(item);
      }
    } else {
      this.etapasSelecionadas = this.etapasSelecionadas.filter(i => i.codEtapa != item.codEtapa);
    }*/
  }

  nextFinished() {
    if (this.$creditosCheched.length == 0) {
      Swal.fire('Asignación de credito', 'Debe seleccionar almenos un credito.', 'warning');
      return;
    }
    const data: any = this.getData();
    this.spinner.show();
    this.asignacionService.asignarCreditosEjecutivo(this.ejecutivoSelected.codUsuario, data).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Asignación de credito', res.mensaje, 'success');
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  private getData() {
    const ejecutivo = this.ejecutivoSelected;
    const cartera = this.carteraSelected;
    const gestion = this.gestionSelected;
    const etapas = this.etapasSelecionadas;
    const desde = this.desde;
    const hasta = this.hasta;
    const sociosOpcional = this.sociosSeleccionados;

    this.errors = [];

    if (!ejecutivo) {
      this.errors.push('Debe seleccionar una ejecutivo de negocio.');
    }

    if (!cartera) {
      this.errors.push('Debe seleccionar una cartera.');
    }

    if (!gestion) {
      this.errors.push('Debe seleccionar una gestión.');
    }

    if (etapas.length == 0) {
      this.errors.push('Debe seleccionar almenos una etapa.');
    }

    if (this.errors.length > 0) {
      return;
    }

    const etapaItems: EjecutivoCarteraEtapa[] = [];

    this.etapasSelecionadas.forEach(i => {
      etapaItems.push({
        codEtapa: i.codEtapa,
        codGestion: i.codGestion
      });
    });

    const campoItems: EjecutivoCarteraCampo[] = [];

    this.selectedProductos.forEach(v => {
      campoItems.push({
        codCampo: CONST.TABLE_STR_LISTA_PRODUCTO_ABACO,
        valor: v,
        opciona: 1
      });
    });

    this.selectedBancas.forEach(v => {
      campoItems.push({
        codCampo: CONST.TABLE_STR_LISTA_BANCA_ABACO,
        valor: v,
        opciona: 1
      });
    });

    this.selectedDivisiones.forEach(v => {
      campoItems.push({
        codCampo: CONST.TABLE_STR_TIPO_DIVISION_ABACO,
        valor: v,
        opciona: 1
      });
    });

    this.selectedComercios.forEach(v => {
      campoItems.push({
        codCampo: CONST.TABLE_STR_TIPO_COMERCIAL_ABACO,
        valor: v,
        opciona: 1
      });
    });

    this.selectedSocios.forEach(v => {
      campoItems.push({
        codCampo: CONST.TABLE_STR_TIPO_DE_SOCIO_ABACO,
        valor: v,
        opciona: 1
      });
    });

    this.selectedClasificacionDeudor.forEach(v => {
      campoItems.push({
        codCampo: CONST.TABLE_STR_CLASIFICACION_DEL_DEUDOR_ABACO,
        valor: v,
        opciona: 1
      });
    });

    this.selectedTipoCreditos.forEach(v => {
      campoItems.push({
        codCampo: CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO,
        valor: v,
        opciona: 1
      });
    });

    this.selectedSedes.forEach(v => {
      campoItems.push({
        codCampo: CONST.TABLE_STR_LISTA_SEDE,
        valor: v,
        opciona: 1
      });
    });

    if (desde) {
      campoItems.push({
        codCampo: CONST.TABLE_INT_MONTO,
        desde,
        hasta,
        opciona: 1
      });
    }

    const data: EjecutivoCartera = {
      codUsuario: this.ejecutivoSelected.codUsuario,
      cartera,
      etapaItems,
      campoItems,
      sociosOpcional,
      creditosAsignados: this.$creditosCheched,
      startDate: this.$startDate,
      endDate: this.$endDate,
      frecuencia: this.frecuencia
    };
    return data;
  }

  validarDesde(event: any, to: HTMLInputElement) {
    this.errorMonto = null;
    const desde = Number(event);
    const hasta = Number(to.value);
    if (desde < 0) {
      this.errorMonto = 'El monto desde no es valido.';
    } else {
      if (desde > hasta && hasta > 0) {
        this.errorMonto = 'El monto desde no puede ser inferior al mondo hasta.';
      }
    }
    if (desde == 0 && hasta > 0) {
      to.value = '';
    }
  }

  validarHasta(event: any, from: HTMLInputElement) {
    this.errorMonto = null;
    const desde = Number(from.value);
    const hasta = Number(event);
    if (hasta < 0) {
      this.errorMonto = 'El monto desde no es valido.';
    } else {
      if (hasta < desde) {
        this.errorMonto = 'El monto hasta no puede ser inferior al mondo desde.';
      }
    }
  }

  private listarSociosByCartera(codCartera) {
    this.asignacionService.listarSociosByCartera(codCartera).pipe(delay(500)).subscribe(items => {
      this.sociosCredito = [...items];
    });
  }

  selecionarSocio(item: SocioCredito, select: NgSelectComponent) {
    if (item) {
      const exits = this.sociosSeleccionados.find(v => v.codUsuario == item.codUsuario);
      if (!exits) {
        this.sociosSeleccionados.push(item);
      }
      select.clearItem(item);
    }
  }

  eliminarSocioCredito(item: SocioCredito) {
    this.sociosSeleccionados = this.sociosSeleccionados.filter(v => v.codUsuario != item.codUsuario);
  }

  changeCheckCreditos(event: any, credito: any) {
    const exist = this.$creditosCheched.find(i => i.id == credito.id);
    if (event.target.checked) {
      if (!exist) {
        this.$creditosCheched.push(credito);
      }
    } else {
      this.$creditosCheched = this.$creditosCheched.filter(i => i.id != credito.id);
    }
    console.log(this.$creditosCheched);
  }

  getItemsCampos(campos: GrupoCampo[]) {
    const tipo = campos[0].codCampo;
    const items: GrupoCampo[] = [];
    switch (tipo) {
      case CONST.TABLE_STR_LISTA_PRODUCTO_ABACO :
        campos.forEach(item => {
          const obj = this.tipoProductos.find(i => i.id == item.valor);
          if (obj) {
            items.push({
              codCampo: item.codCampo,
              descripcion: obj.name
            });
          }
        });
        this.nombreCampoTemp = 'Tipo de Productos';
        break;
      case CONST.TABLE_STR_LISTA_BANCA_ABACO :
        campos.forEach(item => {
          const obj = this.tipoBancas.find(i => i.id == item.valor);
          if (obj) {
            items.push({
              codCampo: item.codCampo,
              descripcion: obj.name
            });
          }
        });
        this.nombreCampoTemp = 'Tipo de Bancas';
        break;
      case CONST.TABLE_STR_TIPO_DIVISION_ABACO :
        campos.forEach(item => {
          const obj = this.tipoDiviciones.find(i => i.id == item.valor);
          if (obj) {
            items.push({
              codCampo: item.codCampo,
              descripcion: obj.name
            });
          }
        });
        this.nombreCampoTemp = 'Tipo de División';
        break;
      case CONST.TABLE_STR_TIPO_COMERCIAL_ABACO :
        campos.forEach(item => {
          const obj = this.tipoComercios.find(i => i.id == item.valor);
          if (obj) {
            items.push({
              codCampo: item.codCampo,
              descripcion: obj.name
            });
          }
        });
        this.nombreCampoTemp = 'Tipo de Comercio';
        break;
      case CONST.TABLE_STR_TIPO_DE_SOCIO_ABACO :
        campos.forEach(item => {
          const obj = this.tipoSocios.find(i => i.id == item.valor);
          if (obj) {
            items.push({
              codCampo: item.codCampo,
              descripcion: obj.name
            });
          }
        });
        this.nombreCampoTemp = 'Tipo de Socio';
        break;
      case CONST.TABLE_STR_CLASIFICACION_DEL_DEUDOR_ABACO :
        campos.forEach(item => {
          const obj = this.tipoCalificacionesDeudor.find(i => i.id == item.valor);
          if (obj) {
            items.push({
              codCampo: item.codCampo,
              descripcion: obj.name
            });
          }
        });
        this.nombreCampoTemp = 'Clasificación de Deudor';
        break;
      case CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO:
        campos.forEach(item => {
          const obj = this.tipoCreditos.find(i => i.id == item.valor);
          if (obj) {
            items.push({
              codCampo: item.codCampo,
              descripcion: obj.name
            });
          }
        });
        this.nombreCampoTemp = 'Tipo de Creditos';
        break;
      case CONST.TABLE_STR_LISTA_SEDE:
        campos.forEach(item => {
          const obj = this.sedes.find(i => i.id == item.valor);
          if (obj) {
            items.push({
              codCampo: item.codCampo,
              descripcion: obj.name
            });
          }
        });
        this.nombreCampoTemp = 'Lista de Sedes';
        break;
      case CONST.TABLE_INT_MONTO:
        const hasta = campos[0].hasta ? `- Hasta: ${campos[0].hasta}` : '';
        items.push({
          codCampo: campos[0].codCampo,
          descripcion: `Desde: ${campos[0].desde} ${hasta}`
        });
        this.nombreCampoTemp = 'Monto';
        break;
    }

    return items;
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
