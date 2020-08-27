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

@Component({
  selector: 'app-asignar-etapas-ejecutivo',
  templateUrl: './asignar-etapas-ejecutivo.component.html',
  styles: []
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
    this.gestiones = cartera.gestiones;
    this.carteraSelected = cartera;

    if (cartera.campos[0].desde) {
      this.showMontos = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_INT_LISTA_SEDE) {
      this.showSedes = false;
    } else if (cartera.campos[0].codCampo == CONST.TABLE_INT_LISTA_TIPO_CREDITO) {
      this.showTipoCredito = false;
    }
    this.ngWizardService.next();
  }

  showEtapa(gestion: Gestion, event?: Event) {
    this.etapasSelecionadas = [];
    this.selectedSedes = [];
    this.selectedTipoCreditos = [];
    this.desde = null;
    this.hasta = null;
    this.etapas = gestion.etapas;
    this.gestionSelected = gestion;
    this.ngWizardService.next();
  }

  nextAdicionales() {
    this.ngWizardService.next();
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
    const ejecutivo = this.ejecutivoSelected;
    const cartera = this.carteraSelected;
    const gestion = this.gestionSelected;
    const etapas = this.etapasSelecionadas;
    const sedes = this.selectedSedes;
    const tipoCreditos = this.selectedTipoCreditos;
    const desde = this.desde;
    const hasta = this.hasta;
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
      campoItems
    };


    console.log([ejecutivo, cartera, gestion, etapas, sedes, tipoCreditos, desde, hasta]);
    console.log(data);
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

}
