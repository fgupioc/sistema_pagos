import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import {ReportesService} from '../../../servicios/reportes/reportes.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {GestorGestiones} from "../../../interfaces/reportes/bitacora-gestiones/gestor-gestiones";

@Component({
  selector: 'app-detalle-cartera-no-asignada',
  templateUrl: './detalle-cartera-no-asignada.component.html',
  styleUrls: ['./detalle-cartera-no-asignada.component.css']
})
export class DetalleCarteraNoAsignadaComponent implements OnInit {
  formSearch: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  itemsSoles: any[] = [];
  itemsDolares: any[] = [];

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
    this.reportesService.datosCarterasNoAsignadas(start, finish).subscribe(
      res => {
        this.itemsSoles = res.itemsSoles;
        this.itemsDolares = res.itemsDolares;
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

  selected(html: any) {
    if ($('.nested.tabla').has('.active')) {
      $('.nested.tabla').removeClass('active');
    }
    $(html).find('.nested.tabla').addClass('active');
  }

  download() {
    const {start, finish} = this.formSearch.getRawValue();
    this.reportesService.generarExcelDetalleCarteraNoAsignada(start, finish).subscribe(
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
          a.download = 'detalle-cartera-no-asignada-' + new Date().getTime();
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 3000);
        }
      }
    );
  }
}
