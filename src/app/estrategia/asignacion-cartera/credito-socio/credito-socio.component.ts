import {Component, OnInit} from '@angular/core';
import {Cartera} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-credito-socio',
  templateUrl: './credito-socio.component.html',
  styles: []
})
export class CreditoSocioComponent implements OnInit {

  cartera: Cartera;
  credito: any;
  ejecutivo: any;
  ejecutivoId: any;
  codSocio: any;
  nombre: string;

  constructor(
    private spinner: NgxSpinnerService,
    private asignacion: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;

    activatedRoute.params.subscribe(({nombre, ejecutivoId, codSocio}) => {
      if (ejecutivoId && nombre) {
        const state = router.getCurrentNavigation().extras.state;
        if (!state) {
          this.router.navigateByUrl('/auth/estrategia/carteras/' + nombre + '/asignacion/' + ejecutivoId + '/creditos');
        }
        if (state) {
          this.cartera = state.cartera;
          this.ejecutivo = state.user;
          this.credito = state.credito;
        } else {
          this.ejecutivoId = ejecutivoId;
          this.nombre = nombre;
          this.codSocio = codSocio;
        }
      } else {
        this.router.navigateByUrl('/auth/estrategia/carteras');
      }
    });
  }

  ngOnInit() {
    if (this.ejecutivoId && this.nombre) {
      this.buscarEjecutivoByCodUsuario(this.ejecutivoId);
      this.getCartera(this.nombre);
    } else if (this.credito) {
      console.log(this.credito);
    } else {
      this.router.navigateByUrl('/auth/estrategia/carteras');
    }
  }

  getCartera(nombre) {
    this.spinner.show();
    this.asignacion.getCartera(nombre).subscribe(
      res => {
        if (res.exito) {
          this.cartera = res.objeto as any;
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  private buscarEjecutivoByCodUsuario(ejecutivoId: string) {
    this.asignacion.buscarEjecutivoByCodUsuario(ejecutivoId).subscribe(
      res => {
        if (res.exito) {
          this.ejecutivo = res.objeto;
          this.ejecutivoId = this.ejecutivo.codUsuario;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
