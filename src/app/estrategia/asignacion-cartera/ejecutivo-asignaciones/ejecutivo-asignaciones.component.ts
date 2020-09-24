import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgWizardService} from 'ng-wizard';
import Swal from 'sweetalert2';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ejecutivo-asignaciones',
  templateUrl: './ejecutivo-asignaciones.component.html',
  styles: []
})
export class EjecutivoAsignacionesComponent implements OnInit {
  asignaciones: any[] = [];
  role: string;

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
}
