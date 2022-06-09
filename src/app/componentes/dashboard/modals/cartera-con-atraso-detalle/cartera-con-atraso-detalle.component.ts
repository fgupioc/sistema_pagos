import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CONST} from '../../../../comun/CONST';
import {FUNC} from '../../../../comun/FUNC';

@Component({
  selector: 'app-cartera-con-atraso-detalle',
  templateUrl: './cartera-con-atraso-detalle.component.html',
  styleUrls: ['./cartera-con-atraso-detalle.component.css']
})
export class CarteraConAtrasoDetalleComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @Input() creditos: any[] = [];
  FUNC = FUNC;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
  }

  get calcularTotal() {
    if (this.creditos.length == 0) {
      return 0.0;
    }
    return  Object.values(this.creditos).reduce((t, {montoCredito}) => t + montoCredito, 0);
  }
}
