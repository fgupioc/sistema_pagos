import {Component, OnInit} from '@angular/core';
import {Cartera} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {Credito} from '../../../interfaces/credito';
import {Persona} from '../../../interfaces/Persona';
import * as moment from 'moment';
import {Telefono} from '../../../interfaces/telefono';
import {Email} from '../../../interfaces/email';
import {Direccion} from '../../../interfaces/direccion';

@Component({
  selector: 'app-credito-socio',
  templateUrl: './credito-socio.component.html',
  styles: []
})
export class CreditoSocioComponent implements OnInit {
  credito: Credito;
  ejecutivoId: any;
  asignacionId: any;
  socio: Persona;
  title = 'Gestionar Eventos Socio';
  typeEvent = 1;
  dateDefault: any;
  showItem: string;
  tipoActividad: any;

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionCarteraService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;

    activatedRoute.params.subscribe(({ejecutivoId, asignacionId}) => {
      if (asignacionId == undefined || ejecutivoId == undefined || asignacionId == 'undefined' || ejecutivoId == 'undefined') {
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
      }

      if (ejecutivoId && asignacionId) {
        this.ejecutivoId = ejecutivoId;
        this.asignacionId = asignacionId;
        const state = this.router.getCurrentNavigation().extras.state;
        if (state) {
          this.credito = state.credito;
        } else {
          router.navigateByUrl(`/auth/estrategia/asignacion-cartera/${ejecutivoId}/listado/${asignacionId}/detalle`);
        }
      } else {
        router.navigateByUrl('/auth/estrategia/asignacion-cartera');
      }

    });
  }

  ngOnInit() {
    this.dateDefault = moment(new Date()).format('YYYY-MM-DD');
    console.log(this.dateDefault);
    if (this.credito) {
      setTimeout(() => this.spinner.show(), 200);
      this.buscarSocioById(this.credito.socioId);
    }
  }

  getCartera(nombre) {
    this.spinner.show();
    this.asignacionCarteraService.getCartera(nombre).subscribe(
      res => {
        if (res.exito) {
          // this.cartera = res.objeto as any;
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
    this.asignacionCarteraService.buscarEjecutivoByCodUsuario(ejecutivoId).subscribe(
      res => {
        if (res.exito) {
          // this.ejecutivo = res.objeto;
          // this.ejecutivoId = this.ejecutivo.codUsuario;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  private buscarSocioById(socioId: number) {
    this.asignacionCarteraService.buscarSocioByCodUsuario(socioId).subscribe(
      res => {
        if (res.exito) {
          this.socio = res.objeto;
          console.log(this.socio);
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  crearRecordatorio(tipo: number, title: string) {
    this.title = title;
    this.typeEvent = tipo;
  }

  public get showPhones(): Telefono[] {
    return this.socio.telefonos;
  }

  public get showCellphones(): Telefono[] {
    return this.socio.telefonos;
  }

  public get showEmails(): Email[] {
    return this.socio.correos;
  }

  public get showAddress(): Direccion[] {
    return this.socio.direcciones;
  }
}
