import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';

@Component({
  selector: 'app-detalle-cartera-no-asignada',
  templateUrl: './detalle-cartera-no-asignada.component.html',
  styleUrls: ['./detalle-cartera-no-asignada.component.css']
})
export class DetalleCarteraNoAsignadaComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  gestionSoles: any[] = [];
  gestionDolares: any[] = [];

  constructor() { }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
  }

}
