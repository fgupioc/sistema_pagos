import {Component, OnInit} from '@angular/core';
import {Autorizacion} from '../../../comun/autorzacion';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import {MenuService} from '../../../servicios/sistema/menu.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {EtapaTemp} from '../../asignacion-cartera/ejecutivo-asignaciones/ejecutivo-asignaciones.component';

@Component({
  selector: 'app-mis-asignaciones-reasignar',
  templateUrl: './mis-asignaciones-reasignar.component.html',
  styleUrls: ['./mis-asignaciones-reasignar.component.css']
})
export class MisAsignacionesReasignarComponent implements OnInit {
  asignaciones: any[] = [];
  role: string;
  etapas: EtapaTemp[] = [];
  ejecutivoSelected: any;
  A = Autorizacion;

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AutenticacionService,
    public menuS: MenuService
  ) {
    activatedRoute.params.subscribe(({ejecutivoUuid}) => {
      this.buscarEjecutivoByCodUsuario(ejecutivoUuid);
      this.listaAsignacionCreditoPorEjecutivo(ejecutivoUuid);
    });
  }

  ngOnInit() {
  }

  private listaAsignacionCreditoPorEjecutivo(uuid: any) {
    if (!uuid) {
      Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
      this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
    }
    this.spinner.show();
    this.asignacionService.listaAsignacionCreditoPorEjecutivo(uuid).subscribe(
      res => {
        if (res.exito) {
          this.asignaciones = res.objeto as any[];
          this.spinner.hide();
        } else {
          Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
          this.spinner.hide();
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }
      },
      err => {
        Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
        this.spinner.hide();
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
      }
    );
  }

  private misAsignacionCreditoPorEjecutivo(uuid: any) {
    this.asignacionService.listaAsignacionCreditoPorEjecutivo(uuid).subscribe(
      res => {
        if (res.exito) {
          this.asignaciones = res.objeto as any[];
        } else {
          Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
          this.router.navigateByUrl('/auth/dashboard');
        }
      },
      err => {
        Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
        this.router.navigateByUrl('/auth/dashboard');
      }
    );
  }

  getClase(item: any) {
    if (!(moment().isBetween(item.startDate, item.endDate))) {
      return 'table-danger';
    }

    if (item.estado == 0) {
      return 'table-warning';
    }

    //return !(moment().isBetween(item.startDate, item.endDate)) ? 'table-danger' : '';
  }

  buscarEjecutivoByCodUsuario(codUsuario) {
    this.asignacionService.buscarEjecutivoByCodUsuario(codUsuario).subscribe(
      res => {
        if (res.exito) {
          this.ejecutivoSelected = res.objeto;
        } else {
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
          Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
        }
      },
      err => {
        console.log(err);
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
      }
    );
  }

}
