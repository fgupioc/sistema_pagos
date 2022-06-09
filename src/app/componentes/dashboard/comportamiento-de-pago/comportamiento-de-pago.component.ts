import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../servicios/dashboard/dashboard.service';
import {Cartera} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import {CarteraConAtrasoDetalleComponent} from '../modals/cartera-con-atraso-detalle/cartera-con-atraso-detalle.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comportamiento-de-pago',
  templateUrl: './comportamiento-de-pago.component.html',
  styleUrls: ['./comportamiento-de-pago.component.css']
})
export class ComportamientoDePagoComponent implements OnInit {
  carteras: Cartera[] = [];
  productos: any[] = [];
  selectCartera = 0;

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.listarCarteras();
    this.listarProductosAbaco(0);
  }

  listarProductosAbaco(carteraId: any) {
    this.spinner.show();
    this.dashboardService.getComportamientoPago(carteraId).subscribe(
      res => {
        if (res.resulset) {
          this.productos = res.resulset;
          this.spinner.hide();
        }
      },
      err => this.spinner.hide()
    );
  }

  calcularPorcentaje(cant: any, total: any) {
    return total == 0 ? 0 : ((cant * 100) / total).toFixed(2);
  }

  private listarCarteras() {
    this.dashboardService.listarCarteras().subscribe(
      res => {
        this.carteras = res;
      }
    );
  }

  mostrarDetalle(desde: number, hasta: number, item: any) {
    this.spinner.show();
    this.dashboardService.getComportamientoPagoCreditos(this.selectCartera, item.codigoProducto, desde, hasta).subscribe(
      res => {
        const modalRef = this.modalService.open(CarteraConAtrasoDetalleComponent, {size: 'xl'});
        modalRef.componentInstance.creditos = res;
        this.spinner.hide();
      },
      err => this.spinner.show()
    );
  }
}
