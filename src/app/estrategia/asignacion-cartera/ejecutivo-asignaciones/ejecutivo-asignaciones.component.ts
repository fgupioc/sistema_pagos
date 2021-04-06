import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import * as moment from 'moment';

export interface EtapaTemp {
  cod: number;
  etapas: any[];
}

@Component({
  selector: 'app-ejecutivo-asignaciones',
  templateUrl: './ejecutivo-asignaciones.component.html',
  styles: []
})
export class EjecutivoAsignacionesComponent implements OnInit {
  asignaciones: any[] = [];
  role: string;
  etapas: EtapaTemp[] = [];
  ejecutivoSelected: any;

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AutenticacionService
  ) {
    const {role} = activatedRoute.snapshot.data;
    if (!role) {
      activatedRoute.params.subscribe(({ejecutivoUuid}) => {
        this.buscarEjecutivoByCodUsuario(ejecutivoUuid);
        this.listaAsignacionCreditoPorEjecutivo(ejecutivoUuid);
      });
    } else {
      const uuid = auth.loggedUser.uuid;
      this.role = role;
      if (uuid) {
        this.misAsignacionCreditoPorEjecutivo(uuid);
      }
    }
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
          console.log(res.objeto)
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
    return !(moment().isBetween(item.startDate, item.endDate)) ? 'table-danger' : '';
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
