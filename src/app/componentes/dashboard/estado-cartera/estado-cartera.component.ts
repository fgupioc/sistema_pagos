import {Component, OnInit} from '@angular/core';
import {CONST} from 'src/app/comun/CONST';
import {EstadosCartera, GrupoCartera} from '../../../interfaces/dashboard/estados-cartera';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MyCurrencyPipe} from '../../../pipes/mycurrency.pipe';
import {Cartera} from '../../../interfaces/cartera';

@Component({
  selector: 'app-estado-cartera',
  templateUrl: './estado-cartera.component.html',
  styleUrls: ['./estado-cartera.component.css']
})
export class EstadoCarteraComponent implements OnInit {
  $carteras: Cartera[] = [];
  carteras: EstadosCartera[] = [];
  sol;
  dolar: any;
  year: number[] = [];
  selectCartera = 0;

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private fmt: MyCurrencyPipe
  ) {
  }

  ngOnInit() {
    this.loadEstadoCarteras(0);
    this.listarCarteras();
  }

  loadEstadoCarteras(carteraId: any) {
    this.carteras = [];
    this.year = [];
    this.sol = null;
    this.dolar = null;
    this.spinner.show();
    this.dashboardService.getEstadoLasCarteras(carteraId).subscribe(
      res => {
        this.spinner.hide();
        this.year.push(res.soles.year);
        this.sol = {
          atraso: res.soles ? [res.soles.atraso] : [],
          dia: res.soles ? [res.soles.dia] : [],
        };

        this.dolar = {
          atraso: res.dolares ? [res.dolares.atraso] : [],
          dia: res.dolares ? [res.dolares.dia] : [],
        };
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  private getTransform(value: any) {
    const res = this.fmt.transform(String(value));
    console.log(res);
    return res;
  }

  private listarCarteras() {
    this.dashboardService.listarCarteras().subscribe(
      res => {
        this.$carteras = res;
      }
    );
  }
}
