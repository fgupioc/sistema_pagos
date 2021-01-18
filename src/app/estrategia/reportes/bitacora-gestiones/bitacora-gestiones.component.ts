import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import {ReportesService} from '../../../servicios/reportes/reportes.service';
import { GestorMoneda } from 'src/app/interfaces/reportes/bitacora-gestiones/gestor-moneda';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

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
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  buttonClasses = [
    'btn-outline-primary',
    'btn-outline-secondary',
    'btn-outline-success',
    'btn-outline-danger',
    'btn-outline-warning',
    'btn-outline-info',
    'btn-outline-light',
    'btn-outline-dark'
  ];
  buttonClass = this.buttonClasses[0];

  constructor(
    private reportesService: ReportesService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {
    this.items = this.getBooks();
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.formSearch = this.formBuilder.group({
      start: ['', Validators.required],
      finish:  ['', Validators.required],
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
    console.log(start);
    console.log(finish);
    this.loadList(start, finish);
  }

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  getBooks(): TreeviewItem[] {
    const childrenCategory = new TreeviewItem({
      text: 'Children', value: 1, collapsed: true, children: [
        { text: 'Baby 3-5', value: 11 },
        { text: 'Baby 6-8', value: 12 },
        { text: 'Baby 9-12', value: 13 }
      ]
    });
    const itCategory = new TreeviewItem({
      text: 'IT', value: 9, children: [
        {
          text: 'Programming', value: 91, children: [{
            text: 'Frontend', value: 911, children: [
              { text: 'Angular 1', value: 9111 },
              { text: 'Angular 2', value: 9112 },
              { text: 'ReactJS', value: 9113, disabled: true }
            ]
          }, {
            text: 'Backend', value: 912, children: [
              { text: 'C#', value: 9121 },
              { text: 'Java', value: 9122 },
              { text: 'Python', value: 9123, checked: false, disabled: true }
            ]
          }]
        },
        {
          text: 'Networking', value: 92, children: [
            { text: 'Internet', value: 921 },
            { text: 'Security', value: 922 }
          ]
        }
      ]
    });

    const othersCategory = new TreeviewItem({ text: 'Others', value: 3, checked: false, disabled: true });
    return [childrenCategory, itCategory, teenCategory, othersCategory];
  }
}
