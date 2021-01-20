import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReportesService} from '../../../servicios/reportes/reportes.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {GestorMoneda} from '../../../interfaces/reportes/bitacora-gestiones/gestor-moneda';
import {GestorGestiones} from '../../../interfaces/reportes/bitacora-gestiones/gestor-gestiones';

@Component({
  selector: 'app-resumen-resultados-por-gestor',
  templateUrl: './resumen-resultados-por-gestor.component.html',
  styleUrls: ['./resumen-resultados-por-gestor.component.css']
})
export class ResumenResultadosPorGestorComponent implements OnInit {
  formSearch: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  itemsSoles: any[] = [];
  itemsDolares: any[] = [];
  $gestiones: any[] = [];
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

  search() {
    if (this.formSearch.invalid) {
      Swal.fire('', 'Debe ingresar los campos obligatorios.', 'warning');
      return;
    }
    const {start, finish} = this.formSearch.getRawValue();
    this.loadList(start, finish);
  }

  loadList(start, finish) {
    this.spinner.show();
    this.reportesService.resumenResultadosPorGestor(start, finish).subscribe(
      res => {
        this.itemsSoles = res.itemsSoles;
        this.itemsDolares = res.itemsDolares;
        console.log(this.itemsSoles);
        setTimeout(() => this.initQuery(), 200);
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
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

  seleccionado(items: any[]) {
    this.$gestiones = [];
    console.log(items);
    this.$gestiones = items;
  }
}
