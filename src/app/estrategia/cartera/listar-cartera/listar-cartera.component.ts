import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {Cartera} from '../../../interfaces/cartera';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-listar-cartera',
  templateUrl: './listar-cartera.component.html',
  styleUrls: ['./listar-cartera.component.css']
})
export class ListarCarteraComponent implements OnInit {
  carteras: Cartera[] = [];

  constructor(
    private router: Router,
    private carteraService: CarteraService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) {
  }

  ngOnInit() {
    this.getCarteras();
  }

  private getCarteras() {
    this.spinner.show();
    this.carteraService.getCarteras().subscribe(
      res => {
        if (res.exito) {
          this.carteras = res.objeto as Cartera[];
          console.log(this.carteras);
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  showDetails(item: Cartera) {
    if (!isNullOrUndefined(item)) {
      this.router.navigateByUrl('/auth/estrategia/carteras/detalle', {state: {cartera: item}});
    }
  }
}
