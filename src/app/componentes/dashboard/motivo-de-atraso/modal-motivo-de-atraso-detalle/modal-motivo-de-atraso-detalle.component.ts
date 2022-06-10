import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CONST} from '../../../../comun/CONST';
import {FUNC} from '../../../../comun/FUNC';

@Component({
  selector: 'app-modal-motivo-de-atraso-detalle',
  templateUrl: './modal-motivo-de-atraso-detalle.component.html',
  styleUrls: ['./modal-motivo-de-atraso-detalle.component.css']
})
export class ModalMotivoDeAtrasoDetalleComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @Input() creditos: any[] = [];
  @Input() respuesta: any;
  @Input() columns: any;
  FUNC = FUNC;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
  }

}
