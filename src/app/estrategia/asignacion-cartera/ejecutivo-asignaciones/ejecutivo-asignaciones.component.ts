import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgWizardService} from 'ng-wizard';
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

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AutenticacionService
  ) {
    const {role} = activatedRoute.snapshot.data;
    if (!role) {
      activatedRoute.params.subscribe(({ejecutivoId}) => this.listaAsignacionCreditoPorEjecutivo(ejecutivoId));
    } else {
      const user = auth.loggedUser.id;
      this.role = role;
      if (user) {
        this.misAsignacionCreditoPorEjecutivo(auth.loggedUser.id);
      }
    }
  }

  ngOnInit() {
  }

  private listaAsignacionCreditoPorEjecutivo(ejecutivoId: any) {
    if (!ejecutivoId) {
      Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
      this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
    }
    this.asignacionService.listaAsignacionCreditoPorEjecutivo(ejecutivoId).subscribe(
      res => {
        if (res.exito) {
          this.asignaciones = res.objeto as any[];
          if (this.asignaciones.length > 0) {
            this.asignaciones.forEach(v => {
              this.obtenerEtapasAsignaciones(v.id);
            });
          }
          this.nombreEtapas(1);
        } else {
          Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
          this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
        }
      },
      err => {
        Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
        this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
      }
    );
  }

  private misAsignacionCreditoPorEjecutivo(ejecutivoId: any) {
    this.asignacionService.listaAsignacionCreditoPorEjecutivo(ejecutivoId).subscribe(
      res => {
        if (res.exito) {
          this.asignaciones = res.objeto as any[];
          if (this.asignaciones.length > 0) {
            this.asignaciones.forEach(v => {
              this.obtenerEtapasAsignaciones(v.id);
            });
          }
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

  obtenerEtapasAsignaciones(id) {
    this.asignacionService.obtenerEtapasAsignaciones(id).subscribe(
      res => {
        this.etapas.push({
          cod: id,
          etapas: res,
        });
      }
    );
  }

  nombreEtapas(id) {
    let nombre = '';
    if (this.etapas.length > 0) {
      const etapa = this.etapas.find(v => v.cod == id);
      if (etapa) {
        etapa.etapas.forEach(i => {
          nombre = i.nombreGestion;
        });
      }
    }
    return nombre;
  }

}
