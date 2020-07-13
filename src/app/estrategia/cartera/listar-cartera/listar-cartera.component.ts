import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {Cartera} from '../../../interfaces/cartera';
import {isNullOrUndefined} from 'util';
import Swal from 'sweetalert2';

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

  cambiarEstado(item: Cartera, estado: string) {
    const text = (estado == '1') ? 'Desactiv' : 'Activ';
    Swal.fire({
      title: text + 'ar Cartera?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ' + text + 'ar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.carteraService.cambiarEstado(String(item.codCartera),  (estado == '1') ? '0' : '1').subscribe(
          res => {
            if (res.exito) {
              item.estado = (estado == '1') ? '0' : '1';
              Swal.fire(
                '',
                'La Cartera se ' + text + 'ó con exito.',
                'success'
              );
            } else {
              Swal.fire(
                '',
                res.mensaje,
                'error'
              );
            }
            this.spinner.hide();
          }
        );
      }
    });
  }
}
