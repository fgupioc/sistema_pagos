import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EtapaTemp} from '../ejecutivo-asignaciones/ejecutivo-asignaciones.component';
import * as moment from 'moment';

@Component({
  selector: 'app-supervisor-asignaciones',
  templateUrl: './supervisor-asignaciones.component.html',
  styleUrls: ['./supervisor-asignaciones.component.css']
})
export class SupervisorAsignacionesComponent implements OnInit {
  asignaciones: any[] = [];
  etapas: EtapaTemp[] = [];

  constructor(
    private auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.listaAsignacionCreditoPorEjecutivo(this.auth.loggedUser.uuid);
  }

  private listaAsignacionCreditoPorEjecutivo(ejecutivoUuid: any) {
    if (!ejecutivoUuid) {
      Swal.fire('Asignación de Cartera', 'EL Asesor de negocio no existe.', 'error');
      this.router.navigateByUrl('/auth/estrategia/asignacion-cartera');
    }
    this.spinner.show();
    this.asignacionService.listaAsignacionCreditoPorEjecutivo(ejecutivoUuid).subscribe(
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

  getClase(item: any) {
    return !(moment().isBetween(item.startDate, item.endDate)) ? 'table-danger' : '';
  }
}
