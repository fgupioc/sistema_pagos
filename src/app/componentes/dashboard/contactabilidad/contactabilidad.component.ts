import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-contactabilidad',
  templateUrl: './contactabilidad.component.html',
  styleUrls: ['./contactabilidad.component.css']
})
export class ContactabilidadComponent implements OnInit {
  contactadosSoles: any[] = [];
  contactadosDolar: any[] = [];
  noContactadosSoles: any[] = [];
  noContactadosDolar: any[] = [];
  noRespondieronSoles: any[] = [];
  noRespondieronDolar: any[] = [];
  contactadosSolesAtraso: any[] = [];
  contactadosDolarAtraso: any[] = [];
  noContactadosSolesAtraso: any[] = [];
  noContactadosDolarAtraso: any[] = [];
  noRespondieronSolesAtraso: any[] = [];
  noRespondieronDolarAtraso: any[] = [];

  charSoles: any[] = [];
  charDolar: any[] = [];
  charSolesAtraso: any[] = [];
  charDolarAtraso: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.spinner.show();
    this.dashboardService.getContactabilidad().subscribe(
      res => {
        this.contactadosSoles = res.contactadosSoles;
        this.contactadosDolar = res.contactadosDolar;
        this.noContactadosSoles = res.noContactadosSoles;
        this.noContactadosDolar = res.noContactadosDolar;
        this.noRespondieronSoles = res.noRespondieronSoles;
        this.noRespondieronDolar = res.noRespondieronDolar;
        this.contactadosSolesAtraso = res.contactadosSolesAtraso;
        this.contactadosDolarAtraso = res.contactadosDolarAtraso;
        this.noContactadosSolesAtraso = res.noContactadosSolesAtraso;
        this.noContactadosDolarAtraso = res.noContactadosDolarAtraso;
        this.noRespondieronSolesAtraso = res.noRespondieronSolesAtraso;
        this.noRespondieronDolarAtraso = res.noRespondieronDolarAtraso;

        this.charSoles = [this.calcularSumaMonto(res.contactadosSoles), this.calcularSumaMonto(res.noContactadosSoles), this.calcularSumaMonto(res.noRespondieronSoles)];
        this.charDolar = [this.calcularSumaMonto(res.contactadosDolar), this.calcularSumaMonto(res.noContactadosDolar), this.calcularSumaMonto(res.noRespondieronDolar)];

        this.charSolesAtraso = [this.calcularSumaMonto(res.contactadosSolesAtraso), this.calcularSumaMonto(res.noContactadosSolesAtraso), this.calcularSumaMonto(res.noRespondieronSolesAtraso)];
        this.charDolarAtraso = [this.calcularSumaMonto(res.contactadosDolarAtraso), this.calcularSumaMonto(res.noContactadosDolarAtraso), this.calcularSumaMonto(res.noRespondieronDolarAtraso)];

        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  calcularSumaMonto(items: any[]) {
    return items.length == 0 ? 0 : Object.values(items).reduce((t, {montoCuota}) => t + montoCuota, 0);
  }
}
