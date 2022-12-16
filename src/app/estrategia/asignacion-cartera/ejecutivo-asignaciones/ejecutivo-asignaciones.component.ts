import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import * as moment from 'moment';
import {Autorizacion} from '../../../comun/autorzacion';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {ToastrService} from 'ngx-toastr';

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
  A = Autorizacion;
  ejecutivoUuid: string;

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AutenticacionService,
    public menuS: MenuService,
    private toastr: ToastrService
  ) {
    const {role} = activatedRoute.snapshot.data;
    if (!role) {
      activatedRoute.params.subscribe(({ejecutivoUuid}) => {
        this.ejecutivoUuid = ejecutivoUuid;
        this.buscarEjecutivoByCodUsuario(ejecutivoUuid);
        this.listaAsignacionCreditoPorEjecutivo(ejecutivoUuid);
      });
    } else {
      const uuid = auth.loggedUser.uuid;
      this.role = role;
      if (uuid) {
        this.ejecutivoUuid = uuid;
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

    if (item.estado == '0') {
      return 'table-error';
    }

    if (item.estado == 'C') {
      return 'table-warning';
    }
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

  cancelarAsignacion(asigancioUuid: any) {
    Swal.fire({
      title: '¿Estas segura?',
      text: '¡No podrás revertir esto. Los créditos se liberarán en su totalidad!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cancelar!',
      cancelButtonText: 'Conservar'
    }).then(({value}) => {
      if (value) {
        this.spinner.show('anular');
        this.asignacionService.anularAsignacion(asigancioUuid).subscribe(
          res => {
            this.spinner.hide('anular');
            this.toastr.success('Asignación anulada correctamente.', 'Asignación', {timeOut: 9000});
            this.listaAsignacionCreditoPorEjecutivo(this.ejecutivoUuid);
          }, error => {
            this.spinner.hide('anular');
            Swal.fire('Asignación', 'Ourrio un error en el proceso.', 'error');
          }
        );
      }
    });
  }

  getEstado(estado: any) {
    if (estado == '1') {
      return 'Activo';
    }
    if (estado == '0') {
      return 'Inactivo';
    }
    if (estado == 'C') {
      return 'Anulado';
    }
  }

}
