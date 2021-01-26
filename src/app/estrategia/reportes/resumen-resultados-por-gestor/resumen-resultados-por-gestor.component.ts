import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReportesService} from '../../../servicios/reportes/reportes.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';

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

  $totalCobrar = 0;
  $totalCobrado = 0;
  $totalCobradoParcial = 0;
  $totalCobradoCompleto = 0;
  $totalNoPagado = 0;
  $totalSaldoPorPagar = 0;
  $nivelRecaudacion = 0;
  $nivelSaldoPendiente = 0;
  $cantidadCobrar = 0;
  $cantidadCobrado = 0;
  $cantidadCobradoParcial = 0;
  $cantidadCobradoCompleto = 0;
  $cantidadNoPagada = 0;
  $nivelRecaudacionCan = 0;

  $totalCobrarDol = 0;
  $totalCobradoDol = 0;
  $totalCobradoParcialDol = 0;
  $totalCobradoCompletoDol = 0;
  $totalNoPagadoDol = 0;
  $totalSaldoPorPagarDol = 0;
  $nivelRecaudacionDol = 0;
  $nivelSaldoPendienteDol = 0;
  $cantidadCobrarDol = 0;
  $cantidadCobradoDol = 0;
  $cantidadCobradoParcialDol = 0;
  $cantidadCobradoCompletoDol = 0;
  $cantidadNoPagadaDol = 0;
  $nivelRecaudacionCanDol = 0;

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
        this.calcular(this.itemsSoles, this.itemsDolares);
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

  selected(html: any) {
    if ($('.nested.tabla').has('.active')) {
      $('.nested.tabla').removeClass('active');
    }
    $(html).find('.nested.tabla').addClass('active');
  }


  download() {
    const {start, finish} = this.formSearch.getRawValue();
    this.reportesService.generarExcelResumenResultadosPorGestor(start, finish).subscribe(
      response => {
        const blob = new Blob([response],
          {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        const objectUrl = (window.URL).createObjectURL(blob);
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, 'companyUsers.xlsx');
        } else {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          a.download = 'exportar-resumen-resultados-por-gestor-' + new Date().getTime();
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 3000);
        }
      }
    );
  }

  private calcular(itemsSoles: any[], itemsDolares: any[]) {
    this.$totalCobrar = 0;
    this.$totalCobrado = 0;
    this.$totalCobradoParcial = 0;
    this.$totalCobradoCompleto = 0;
    this.$totalNoPagado = 0;
    this.$totalSaldoPorPagar = 0;
    this.$nivelRecaudacion = 0;
    this.$nivelSaldoPendiente = 0;
    this.$cantidadCobrar = 0;
    this.$cantidadCobrado = 0;
    this.$cantidadCobradoParcial = 0;
    this.$cantidadCobradoCompleto = 0;
    this.$cantidadNoPagada = 0;
    this.$nivelRecaudacionCan = 0;


    this.$totalCobrarDol = 0;
    this.$totalCobradoDol = 0;
    this.$totalCobradoParcialDol = 0;
    this.$totalCobradoCompletoDol = 0;
    this.$totalNoPagadoDol = 0;
    this.$totalSaldoPorPagarDol = 0;
    this.$nivelRecaudacionDol = 0;
    this.$nivelSaldoPendienteDol = 0;
    this.$cantidadCobrarDol = 0;
    this.$cantidadCobradoDol = 0;
    this.$cantidadCobradoParcialDol = 0;
    this.$cantidadCobradoCompletoDol = 0;
    this.$cantidadNoPagadaDol = 0;
    this.$nivelRecaudacionCanDol = 0;

    for (const item of itemsSoles) {
      this.$totalCobrar += item.totalCobrar;
      this.$totalCobrado += item.totalCobrado;
      this.$totalCobradoParcial += item.totalCobradoParcial;
      this.$totalCobradoCompleto += item.totalCobradoCompleto;
      this.$totalNoPagado += item.totalNoPagado;
      this.$totalSaldoPorPagar += item.totalSaldoPorPagar;
      this.$nivelRecaudacion += item.nivelRecaudacion;
      this.$nivelSaldoPendiente += item.nivelSaldoPendiente;

      this.$cantidadCobrar += item.cantidadCobrar;
      this.$cantidadCobrado += item.cantidadCobrado;
      this.$cantidadCobradoParcial += item.cantidadCobradoParcial;
      this.$cantidadCobradoCompleto += item.cantidadCobradoCompleto;
      this.$cantidadNoPagada += item.cantidadNoPagada;
      this.$nivelRecaudacionCan += item.nivelRecaudacionCan;

    }

    for (const item of itemsSoles) {
      this.$totalCobrarDol += item.totalCobrar;
      this.$totalCobradoDol += item.totalCobrado;
      this.$totalCobradoParcialDol += item.totalCobradoParcial;
      this.$totalCobradoCompletoDol += item.totalCobradoCompleto;
      this.$totalNoPagadoDol += item.totalNoPagado;
      this.$totalSaldoPorPagarDol += item.totalSaldoPorPagar;
      this.$nivelRecaudacionDol += item.nivelRecaudacion;
      this.$nivelSaldoPendienteDol += item.nivelSaldoPendiente;
      this.$cantidadCobrarDol = item.cantidadCobrarDol;
      this.$cantidadCobradoDol = item.cantidadCobradoDol;
      this.$cantidadCobradoParcialDol = item.cantidadCobradoParcialDol;
      this.$cantidadCobradoCompletoDol = item.cantidadCobradoCompletoDol;
      this.$cantidadNoPagadaDol = item.cantidadNoPagadaDol;
      this.$nivelRecaudacionCanDol = item.nivelRecaudacionCanDol;
    }
  }
}
