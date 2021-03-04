import {Component, OnInit} from '@angular/core';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {FUNC} from '../../../comun/FUNC';
import {Cartera} from '../../../interfaces/cartera';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {CONST} from '../../../comun/CONST';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-motivo-de-atraso',
  templateUrl: './motivo-de-atraso.component.html',
  styleUrls: ['./motivo-de-atraso.component.css']
})
export class MotivoDeAtrasoComponent implements OnInit {
  respuestas: any[] = [];
  carteras: Cartera[] = [];
  monedas: TablaMaestra[] = [];
  selectCartera: any;
  selectMoneda: any;
  showData = false;

  constructor(
    private tablaMaestraService: MaestroService,
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.listarMondas();
    this.listarTiposRespuestas();
    this.listarCarteras();
  }

  listarTiposRespuestas() {
    this.tablaMaestraService.listarTiposRespuestas().subscribe(
      res => {
        this.respuestas = res.filter(i => i.intValor == 0 || i.intValor == 2);
        this.respuestas.map(i => i.total = 0);
      },
      error => console.log(error)
    );
  }

  listarMondas() {
    this.tablaMaestraService.listarMondas().subscribe(
      res => {
        this.monedas = res.filter(i => i.codItem != 'EUR');
      },
    );
  }

  getClass(index) {
    return FUNC.getClassBG(index);
  }

  getItems(strValor: string): any[] {
    return strValor.split(',');
  }

  private listarCarteras() {
    this.dashboardService.listarCarteras().subscribe(
      res => {
        this.carteras = res;
      }
    );
  }

  loadData() {
    this.showData = false;
    this.respuestas.map(i => i.total = 0);
    this.spinner.show();
    this.dashboardService.getMotivoAtraso(this.selectCartera, this.selectMoneda).subscribe(
      res => {
        if (res.exito && res.creditos.length > 0) {
          this.showData = true;
          for (const item of res.creditos) {
            const index = this.respuestas.findIndex(i => i.codItem == item.codigoRespuesta);
            if (index >= 0) {
              this.respuestas[index].total += this.respuestas[index].total + 1;
            }
          }
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }
}
