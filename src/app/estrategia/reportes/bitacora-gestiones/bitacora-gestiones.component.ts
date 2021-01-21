import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import {ReportesService} from '../../../servicios/reportes/reportes.service';
import {GestorMoneda} from 'src/app/interfaces/reportes/bitacora-gestiones/gestor-moneda';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {TreeviewItem, TreeviewConfig} from 'ngx-treeview';
import {GestorGestiones} from '../../../interfaces/reportes/bitacora-gestiones/gestor-gestiones';

@Component({
  selector: 'app-bitacora-gestiones',
  templateUrl: './bitacora-gestiones.component.html',
  styleUrls: ['./bitacora-gestiones.component.css']
})
export class BitacoraGestionesComponent implements OnInit {
  formSearch: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  itemsSoles: GestorMoneda[] = [];
  itemsDolares: GestorMoneda[] = [];
  totalCreditosAsignadosDolar = 0;
  totalCreditosAsignadosEuro = 0;
  totalCreditosAsignadosSoles = 0;
  totalGestionesRealizadasDolar = 0;
  totalGestionesRealizadasEuro = 0;
  totalGestionesRealizadasSoles = 0;
  totalGestionesNoRealizadasDolar = 0;
  totalGestionesNoRealizadasSoles: any;

  dropdownEnabled = true;
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  $gestiones: GestorGestiones[] = [];
  $type: number;

  constructor(
    private reportesService: ReportesService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.formSearch = this.formBuilder.group({
      start: ['', Validators.required],
      finish: ['', Validators.required],
    });
  }

  loadList(start, finish) {
    this.spinner.show();
    this.reportesService.bitacoraGestiones(start, finish).subscribe(
      res => {
        this.itemsSoles = res.itemsSoles;
        this.itemsDolares = res.itemsDolares;
        this.totalCreditosAsignadosDolar = res.totalCreditosAsignadosDolar;
        this.totalCreditosAsignadosEuro = res.totalCreditosAsignadosEuro;
        this.totalCreditosAsignadosSoles = res.totalCreditosAsignadosSoles;
        this.totalGestionesNoRealizadasSoles = res.totalGestionesNoRealizadasSoles;
        this.totalGestionesNoRealizadasDolar = res.totalGestionesNoRealizadasDolar;
        this.totalGestionesRealizadasDolar = res.totalGestionesRealizadasDolar;
        this.totalGestionesRealizadasEuro = res.totalGestionesRealizadasEuro;
        this.totalGestionesRealizadasSoles = res.totalGestionesRealizadasSoles;

        setTimeout(() => this.initQuery(), 200);
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  getNameCondition(value) {
    return value == 'V' ? 'Vencida' : 'Completada';
  }

  search() {
    if (this.formSearch.invalid) {
      Swal.fire('', 'Debe ingresar los campos obligatorios.', 'warning');
      return;
    }
    const {start, finish} = this.formSearch.getRawValue();
    this.loadList(start, finish);
  }

  generateTree(items: GestorMoneda[]): TreeviewItem[] {
    const gestores: any[] = [];
    for (let item of items) {
      const cartera: any[] = [];
      for (let value of item.carteras) {
        cartera.push(
          {
            text: value.cartera,
            checked: false,
            value: item.gestorCod + '_' + value.carteraCod
          }
        );
      }
      gestores.push({
        text: item.gestor,
        value: item.gestor,
        checked: false,
        children: cartera
      });
    }

    const itCategory = new TreeviewItem({
      text: 'Soles',
      value: 0,
      checked: false,
      children: gestores
    });
    return [itCategory];
  }


  initQuery() {
    const toggler = document.getElementsByClassName('caret');
    let i;

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener('click', function() {
        this.parentElement.querySelector('.nested').classList.toggle('active');
        this.classList.toggle('caret-down');
      });
    }
  }

  seleccionado(items: GestorGestiones[]) {
    this.$gestiones = [];
    this.$gestiones = items;
  }

  selected(html: any) {
    if ($('.nested.tabla').has('.active')) {
      $('.nested.tabla').removeClass('active');
    }
    $(html).find('.nested.tabla').addClass('active');
  }
}
