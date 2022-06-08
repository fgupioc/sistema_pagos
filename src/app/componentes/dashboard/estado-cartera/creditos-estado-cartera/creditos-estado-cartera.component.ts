import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CONST} from '../../../../comun/CONST';
import {FUNC} from '../../../../comun/FUNC';

@Component({
  selector: 'app-creditos-estado-cartera',
  templateUrl: './creditos-estado-cartera.component.html',
  styleUrls: ['./creditos-estado-cartera.component.css']
})
export class CreditosEstadoCarteraComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  @Input() creditos: any[] = [];
  FUNC = FUNC;
  @Input() titulo: string;
  @Input() subtitulo: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
  }

  get calcularTotal() {
    if (this.creditos.length == 0) {
      return 0.0;
    }
    return  Object.values(this.creditos).reduce((t, {creditoVigente}) => t + creditoVigente, 0);
  }
}
