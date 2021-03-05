import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Cartera} from '../../../interfaces/cartera';

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

  selectCartera: any;
  carteras: Cartera[] = [];


  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.listarCarteras();
  }

  private loadData(carteraId: any) {
    this.spinner.show();
    this.dashboardService.getContactabilidad(carteraId).subscribe(
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

  private listarCarteras() {
    this.dashboardService.listarCarteras().subscribe(
      res => {
        this.carteras = res;
        if (this.carteras.length > 0) {
          this.selectCartera = this.carteras[0].codCartera;
          this.loadData(this.selectCartera);
        }
      }
    );
  }

  canSee(number: any) {
    if (number == 1) {
      return this.contactadosDolarAtraso.length == 0 &&
        this.contactadosSolesAtraso.length == 0 &&
        this.noContactadosDolarAtraso.length == 0 &&
        this.noContactadosSolesAtraso.length == 0 &&
        this.noRespondieronDolarAtraso.length == 0 &&
        this.noRespondieronSolesAtraso.length == 0;
    } else {
      return this.contactadosDolar.length == 0 &&
        this.contactadosSoles.length == 0 &&
        this.noContactadosDolar.length == 0 &&
        this.noContactadosSoles.length == 0 &&
        this.noRespondieronDolar.length == 0 &&
        this.noRespondieronSoles.length == 0;
    }

  }
}
