import {Component, OnInit, ViewChild} from '@angular/core';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';
import {FUNC} from '../../../comun/FUNC';

@Component({
  selector: 'app-mis-gestiones',
  templateUrl: './mis-gestiones.component.html',
  styleUrls: ['./mis-gestiones.component.css'],
})
export class MisGestionesComponent implements OnInit {
  creditos: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  FUNC = FUNC;

  constructor(
    private gestionAdministrativaService: GestionAdministrativaService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
    this.listarCreditos();
  }

  private listarCreditos() {
    this.spinner.show();
    this.gestionAdministrativaService
      .listarCreditosAsignadosPorEjecutivo()
      .subscribe((res) => {
        if (res.exito) {
          this.creditos = res.objeto as any[];
        }
        this.spinner.hide();
      });
  }

}
