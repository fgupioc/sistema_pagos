import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SocioInvitadoService} from '../../../servicios/socio/socio-invitado.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CONST} from '../../../comun/CONST';

@Component({
  selector: 'app-socio-creditos',
  templateUrl: './socio-creditos.component.html',
  styleUrls: ['./socio-creditos.component.css']
})
export class SocioCreditosComponent implements OnInit {
  token: string;
  creditos: any[] = [];
  socio: any;
  show = true;
  mensaje: string;
  codSol = CONST.ENUM_MONEDA.SOL;
  codDolar = CONST.ENUM_MONEDA.DOLAR;
  codEuro = CONST.ENUM_MONEDA.EURO;
  totalSoles = 0;
  totalDolares = 0;
  totalEuros = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private socioInvitadoService: SocioInvitadoService,
    private spinner: NgxSpinnerService
  ) {
    activatedRoute.params.subscribe(({token}) => this.token = token);
  }

  ngOnInit() {
    if (this.token) {
      this.misCreditos();
    }
  }

  misCreditos() {
    this.spinner.show();
    this.socioInvitadoService.misCreditos(this.token).subscribe(
      res => {
        this.show = res.exito;
        if (res.exito) {
          this.creditos = res.objeto;
          this.creditos.forEach(item => {
            if (item.codMoneda == this.codSol) {
              this.totalSoles += item.montoCuota;
            } else if (item.codMoneda == this.codDolar) {
              this.totalDolares += item.montoCuota;
            } else if (item.codMoneda == this.codEuro) {
              this.totalEuros += item.montoCuota;
            }
          });
          this.socio = res.socio;
        } else {
          this.mensaje = res.mensaje;
        }
        this.spinner.hide();
      },
      err => {
        this.show = false;
        this.mensaje = 'El link ya no se encuentra activo. Comuníquese con la cooperativa.';
        this.spinner.hide();
      }
    );
  }
}
