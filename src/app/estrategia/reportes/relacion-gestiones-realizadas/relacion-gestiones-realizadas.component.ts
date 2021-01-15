import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';

@Component({
  selector: 'app-relacion-gestiones-realizadas',
  templateUrl: './relacion-gestiones-realizadas.component.html',
  styleUrls: ['./relacion-gestiones-realizadas.component.css']
})
export class RelacionGestionesRealizadasComponent implements OnInit {

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
