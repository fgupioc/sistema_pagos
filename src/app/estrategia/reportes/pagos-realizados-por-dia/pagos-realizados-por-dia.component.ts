import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CompromisoDePago} from '../../../models/reportes/compromiso-de-pago';
import {ReportesService} from '../../../servicios/reportes/reportes.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CONST} from '../../../comun/CONST';
import Swal from 'sweetalert2';
import {PagosRealizadosPorDia} from '../../../models/reportes/pagos-realizados-por-dia';

@Component({
  selector: 'app-pagos-realizados-por-dia',
  templateUrl: './pagos-realizados-por-dia.component.html',
  styleUrls: ['./pagos-realizados-por-dia.component.css']
})
export class PagosRealizadosPorDiaComponent implements OnInit {
  formSearch: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  itemsSoles: PagosRealizadosPorDia[] = [];

  constructor(
    private reportesService: ReportesService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.formSearch = this.formBuilder.group({
      start: ['', Validators.required]
    });
  }

  search() {
    if (this.formSearch.invalid) {
      Swal.fire('', 'Debe ingresar los campos obligatorios.', 'warning');
      return;
    }
    const {start} = this.formSearch.getRawValue();
    this.loadList(start);
  }

  loadList(start) {
    this.spinner.show();
    this.reportesService.pagosRealizadosPorDia(start).subscribe(
      res => {
        console.log(res.itemsSoles);
        this.itemsSoles = res.itemsSoles as PagosRealizadosPorDia[];
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  download() {
    const {start} = this.formSearch.getRawValue();
    this.spinner.show();
    this.reportesService.generarExcelPagoRealizadoPorDia(start).subscribe(
      response => {
        const blob = new Blob([response],
          {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        const objectUrl = (window.URL).createObjectURL(blob);
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, 'pagos-realizados-por-dia.xlsx');
        } else {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          a.download = 'pagos-realizados-por-dia-' + new Date().getTime();
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 3000);
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
