import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Cartera} from '../../../interfaces/cartera';
import * as moment from 'moment';

@Component({
  selector: 'app-contactabilidad',
  templateUrl: './contactabilidad.component.html',
  styleUrls: ['./contactabilidad.component.css']
})
export class ContactabilidadComponent implements OnInit {
  atrasoDolares: any;
  atrasoSoles: any;
  sinAtrasoDolares: any;
  sinAtrasoSoles: any;

  charSoles: any[] = [];
  charDolar: any[] = [];
  charSolesAtraso: any[] = [];
  charDolarAtraso: any[] = [];

  selectCartera: any;
  carteras: Cartera[] = [];
  dateDefault = moment(new Date()).format('YYYY-MM-DD');

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.listarCarteras();
  }

  private loadData(carteraId: any, fecha: any) {
    console.log(fecha);
    this.spinner.show();
    this.dashboardService.getContactabilidad(carteraId, fecha).subscribe(
      res => {


        this.charSoles = [res.atrasoSoles.cantContactados, res.atrasoSoles.cantNoContactados, res.atrasoSoles.cantNoRespondieron];
        this.charDolar = [res.atrasoDolares.cantContactados, res.atrasoDolares.cantNoContactados, res.atrasoDolares.cantNoRespondieron];

        this.charSolesAtraso = [res.sinAtrasoSoles.cantContactados, res.sinAtrasoSoles.cantNoContactados, res.sinAtrasoSoles.cantNoRespondieron];
        this.charDolarAtraso = [res.sinAtrasoDolares.cantContactados, res.sinAtrasoDolares.cantNoContactados, res.sinAtrasoDolares.cantNoRespondieron];

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
          this.loadData(this.selectCartera, this.dateDefault);
        }
      }
    );
  }

}
