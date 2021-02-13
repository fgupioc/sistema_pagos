import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import {ReportesService} from '../../../servicios/reportes/reportes.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {GestorGestiones} from '../../../interfaces/reportes/bitacora-gestiones/gestor-gestiones';

export interface Rep {
  codEtapa: string;
  etapa: string;
  total: number;
}

@Component({
  selector: 'app-relacion-gestiones-realizadas',
  templateUrl: './relacion-gestiones-realizadas.component.html',
  styleUrls: ['./relacion-gestiones-realizadas.component.css']
})
export class RelacionGestionesRealizadasComponent implements OnInit {
  formSearch: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  itemSoles: any[] = [];
  itemDolares: any[] = [];
  repSolEtapas: any[] = [];
  repDolEtapas: any[] = [];
  etapas: any[] = [];

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

  loadList(start, finish) {
    this.spinner.show();
    this.reportesService.relacionGestionesRealizadas(start, finish).subscribe(
      res => {
        this.itemSoles = res.itemsSoles;
        const etapas: any[] = res.etapas;
        etapas.map(i => {
          i.totalGestiones = 0;
          i.totalCreditosAsignados = 0;
          i.totalCreditosSinGestion = 0;
          i.nivelGestion = 0;
        });
        this.repSolEtapas = etapas;
        this.repDolEtapas = etapas;
        this.addElements(res.itemsSoles, this.repSolEtapas);
        this.addElements(res.itemsDolares, this.repDolEtapas);

        setTimeout(() => this.initQuery(), 200);
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  search() {
    if (this.formSearch.invalid) {
      Swal.fire('', 'Debe ingresar los campos obligatorios.', 'warning');
      return;
    }
    const {start, finish} = this.formSearch.getRawValue();
    this.loadList(start, finish);
  }

  addElements(itemsSoles: any[], array: any[]) {
    for (const item of itemsSoles) {
      for (const etapa of item.etapas) {
        const index = array.findIndex(i => i.codEtapa == etapa.codEtapa);
        if (index >= 0) {
          array[index].totalGestiones = array[index].totalGestiones + Number(etapa.totalGestiones);
          array[index].totalCreditosAsignados = array[index].totalCreditosAsignados + Number(etapa.totalCreditosAsignados);
          array[index].totalCreditosSinGestion = array[index].totalCreditosSinGestion + Number(etapa.totalCreditosSinGestion);
        }
      }
    }
    array.map(i => {
      if (i.totalCreditosAsignados == 0) {
        i.nivelGestion = i.totalCreditosSinGestion == 0 ? 0 : 100;
      } else {
        i.nivelGestion = (1 - (i.totalCreditosSinGestion / i.totalCreditosAsignados)) * 100;
      }
    });
  }

  getTotal(array: Rep[]): number {
    let total = 0;
    for (const item of array) {
      total += Number(item.total);
    }
    return total;
  }

  selected(html: any) {
    if ($('.nested.tabla').has('.active')) {
      $('.nested.tabla').removeClass('active');
    }
    $(html).find('.nested.tabla').addClass('active');
  }


  download() {
    this.spinner.show();
    const {start, finish} = this.formSearch.getRawValue();
    this.reportesService.getUrlRelacionGestionesRealizadas(start, finish).subscribe(
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
          a.download = 'relacion-gestiones-realizadas-' + new Date().getTime();
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 3000);
        }
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

  seleccionado(items: GestorGestiones[]) {
    this.$gestiones = [];
    this.$gestiones = items;
  }

  getCalcularTital(repSolEtapas: any[], name: string) {
    let sum = 0;
    for (const item of repSolEtapas) {
      sum += item[name];
    }
    return Math.round(sum);
  }

  calcularNivelGestion(repSolEtapas: any[]) {
    let sum = 0;
    let asignados = 0;
    let sinGestion = 0;

    for (const item of repSolEtapas) {
      asignados += item.totalCreditosAsignados;
      sinGestion += item.totalCreditosSinGestion;
    }

    if (asignados > 0) {
      sum = (1 - (sinGestion / asignados)) * 100;
    } else {
      sum = asignados == 0 ? 100 : 0;
    }
    return Math.round(sum);
  }
}
