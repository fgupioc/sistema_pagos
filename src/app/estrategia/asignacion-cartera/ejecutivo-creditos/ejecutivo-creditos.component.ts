import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Cartera} from '../../../interfaces/cartera';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {ModalGestionarTareaComponent} from '../modal-gestionar-tarea/modal-gestionar-tarea.component';
import {ModalGestionarPromesasPagoComponent} from '../modal-gestionar-promesas-pago/modal-gestionar-promesas-pago.component';

@Component({
  selector: 'app-ejecutivo-creditos',
  templateUrl: './ejecutivo-creditos.component.html',
  styles: []
})
export class EjecutivoCreditosComponent implements OnInit {
  cartera: Cartera;
  ejecutivo: any;
  ejecutivoId: any;
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

    activatedRoute.params.subscribe(({nombre, ejecutivoId}) => {
      if (ejecutivoId && nombre) {
        const state = router.getCurrentNavigation().extras.state;
        if (state) {
          this.cartera = state.cartera;
          this.ejecutivo = state.user;
          this.listarCreditosByCarteraAndEjecutivo(this.cartera.codCartera, this.ejecutivo.codUsuario);
        } else {
          this.ejecutivoId = ejecutivoId;
          this.nombre = nombre;
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
    }
  }

  getCartera(nombre) {
    this.spinner.show();
    this.asignacion.getCartera(nombre).subscribe(
      res => {
        if (res.exito) {
          this.cartera = res.objeto as any;
          this.listarCreditosByCarteraAndEjecutivo(this.cartera.codCartera, this.ejecutivoId);
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

  listarCreditosByCarteraAndEjecutivo(codCartera: any, codUsuario: any) {
    this.asignacion.listarCreditosByCarteraAndEjecutivo(codCartera, codUsuario).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  showModalTarea() {

  }

  closeModalTarea() {

  }

  showModalPromesas() {
    const modal = this.modalService.open(ModalGestionarPromesasPagoComponent, {centered: true});
    modal.result.then(
      this.closeModalTarea.bind(this),
      this.closeModalTarea.bind(this)
    );
  }

  showSocio() {
    const url = '/auth/estrategia/carteras/' + this.cartera.nombreExterno + '/asignacion/' + this.ejecutivo.codUsuario + '/creditos/' + 1 + '/socio';
    console.log(url);
    this.router.navigateByUrl( url, {state: {user: this.ejecutivo, cartera: this.cartera}});
  }
}
