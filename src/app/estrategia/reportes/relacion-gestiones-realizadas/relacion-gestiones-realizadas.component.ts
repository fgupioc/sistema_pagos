import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import { ReportesService } from '../../../servicios/reportes/reportes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

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
  gitemDolares: any[] = [];

  constructor(
    private reportesService: ReportesService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.formSearch = this.formBuilder.group({
      start: ['', Validators.required],
      finish:  ['', Validators.required],
    }); 
  }

  
  loadList(start, finish) {
    this.spinner.show();
    this.reportesService.relacionGestionesRealizadas(start, finish).subscribe(
      res => {
        console.log(res.itemsSoles);
        this.itemSoles = res.itemsSoles;
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

  countItems(array: any[] , tipo):number { 
    const items = array.filter(i => i.codTipoGestion == tipo);
    return items.length;
  }
}
