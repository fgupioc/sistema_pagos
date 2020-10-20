import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreditoService} from '../../../../servicios/estrategia/credito.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../../comun/CONST';

@Component({
  selector: 'app-cartera-cargar-credito-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css']
})
export class CarteraCargarCreditoCreditosComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  cretidosTemps = [];

  constructor(private router: Router, private creditoService: CreditoService, private spinner: NgxSpinnerService,
              private rutaActiva: ActivatedRoute) {
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
    this.listarCreditoTemps(this.rutaActiva.snapshot.params.cargaCreditoId);
  }

  listarCreditoTemps(cargaCreditoId: number) {
    this.spinner.show();
    this.creditoService.listarCreditoTemps(cargaCreditoId).subscribe(
      res => {
        this.spinner.hide();
        this.cretidosTemps = res;
        this.refreshDatatable();
      });
  }

  regresar() {
    this.router.navigate(['/auth/estrategia/cartera/cargar-credito']);
  }

  refreshDatatable() {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }
}
