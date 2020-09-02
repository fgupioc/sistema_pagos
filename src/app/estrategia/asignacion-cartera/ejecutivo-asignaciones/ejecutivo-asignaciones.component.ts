import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgWizardService} from 'ng-wizard';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ejecutivo-asignaciones',
  templateUrl: './ejecutivo-asignaciones.component.html',
  styles: []
})
export class EjecutivoAsignacionesComponent implements OnInit {
  asignaciones: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    activatedRoute.params.subscribe(({ejecutivoId}) => this.listaAsignacionCreditoPorEjecutivo(ejecutivoId));
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

}
