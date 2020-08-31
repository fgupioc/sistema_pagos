import {Component, OnInit} from '@angular/core';
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

declare const $: any;

@Component({
  selector: 'app-asignar-etapas-ejecutivo',
  templateUrl: './asignar-etapas-ejecutivo.component.html',
  styleUrls: ['./asignar-etapas-ejecutivo.component.css']
})
export class AsignarEtapasEjecutivoComponent implements OnInit {
  carteras: Cartera[] = [];
  nombre: string;
  items: TreeviewItem[];
  gestiones: Gestion[] = [];
  etapas: Etapa[] = [];
  tipoCreditos: MultiSelect[] = [];
  sedes: MultiSelect[] = [];
  errors: string[] = [];
  /**********/
  ejecutivoSelected: any;
  carteraSelected: Cartera;
  gestionSelected: Gestion;
  etapasSelecionadas: Etapa[] = [];
  selectedSedes: any[] = [];
  selectedTipoCreditos: any[] = [];
  desde: any;
  hasta: any;
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

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngWizardService: NgWizardService
  ) {
    activatedRoute.params.subscribe(({ejecutivoId}) => this.buscarEjecutivoByCodUsuario(ejecutivoId));
  }

  ngOnInit() {
    this.listaTipoCreditos();
    this.listaSedes();
    this.listarCarteras();
    setTimeout(() => this.initDatepiker(), 3000);
  }

  initDatepiker() {
    moment.locale('es');
    $('#daterange-btn').daterangepicker(
      {
        locale: {
          format: 'YYYY-MM-DD',
          separator: ' - ',
          applyLabel: 'Guardar',
          cancelLabel: 'Cancelar',
          fromLabel: 'Desde',
          toLabel: 'Hasta',
          customRangeLabel: 'Personalizar',
          daysOfWeek: [
            'Do',
            'Lu',
            'Ma',
            'Mi',
            'Ju',
            'Vi',
            'Sa'
          ],
          monthNames: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Setiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
          ],
          firstDay: 1
        },
        ranges: {
          Diaria: [moment(), moment()],
          Semana: [moment(), moment().add(6, 'days')],
          Quincenal: [moment(), moment().add(14, 'days')],
          Mensual: [moment(), moment().add(1, 'month')]
        }
      },
      (start, end) => {
        this.$startDate = start.format('YYYY-MM-DD');
        this.$endDate = end.format('YYYY-MM-DD');
        $('#daterange-btn .text-title').html(` ${start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY')} `);
      }
    );
  }

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  buscarEjecutivoByCodUsuario(codUsuario) {
    this.asignacionService.buscarEjecutivoByCodUsuario(codUsuario).subscribe(
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
    } else if (cartera.campos[0].codCampo == CONST.TABLE_INT_LISTA_SEDE) {
      this.showSedes = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_INT_LISTA_TIPO_CREDITO) {
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
    console.log(data);
    this.asignacionService.buscarCreditosPorFiltro(data.codCartera, data).subscribe(
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
    const etapa = this.etapasSelecionadas.find(i => i.codEtapa == item.codEtapa);
    if (event.target.checked) {
      if (!etapa) {
        this.etapasSelecionadas.push(item);
      }
    } else {
      this.etapasSelecionadas = this.etapasSelecionadas.filter(i => i.codEtapa != item.codEtapa);
    }
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
        console.log(res.objeto);
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
    const sedes = this.selectedSedes;
    const tipoCreditos = this.selectedTipoCreditos;
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
    this.selectedTipoCreditos.forEach(v => {
      campoItems.push({
        codCampo: this.showTipoCredito ? CONST.TABLE_INT_LISTA_TIPO_CREDITO : CONST.TABLE_INT_LISTA_SEDE,
        valor: v,
        opciona: 1
      });
    });

    this.selectedSedes.forEach(v => {
      campoItems.push({
        codCampo: this.showSedes ? CONST.TABLE_INT_LISTA_SEDE : CONST.TABLE_INT_LISTA_TIPO_CREDITO,
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
      codCartera: this.carteraSelected.codCartera,
      etapaItems,
      campoItems,
      sociosOpcional,
      creditosAsignados: this.$creditosCheched,
      startDate: this.$startDate,
      endDate: this.$endDate
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
}
