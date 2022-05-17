import {Component, OnInit} from '@angular/core';
import {GestionService} from '../../../../servicios/estrategia/gestion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {isNullOrUndefined} from 'util';
import {CONST} from '../../../../comun/CONST';
import {MenuService} from '../../../../servicios/sistema/menu.service';
import {Autorizacion} from '../../../../comun/autorzacion';

@Component({
  selector: 'app-listar-gestiones',
  templateUrl: './listar-gestiones.component.html',
  styleUrls: ['./listar-gestiones.component.css']
})
export class ListarGestionesComponent implements OnInit {
  gestiones: any[] = [];
  A = Autorizacion;

  constructor(
    private spinner: NgxSpinnerService,
    private gestionService: GestionService,
    private router: Router,
    public menuService: MenuService
  ) {
  }

  ngOnInit() {
    if (this.menuService.hasShowEtapa(this.A.ETAPA_LISTA)) {
      this.listarGestiones();
    }
  }

  listarGestiones() {
    this.spinner.show();
    this.gestionService.listar().subscribe(
      res => {
        if (res.exito) {
          this.gestiones = res.objeto as any[];
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  showDetails(item: any) {
    this.router.navigateByUrl('/auth/configuracion/gestiones/actualizar', {state: {id: item.codGestion}});
  }

  cambiarEstado(item: any, s: string) {
    const text = s == '0' ? 'Desactivar' : 'Activar';
    Swal.fire({
      title: 'Estas segura?',
      text: text + ' Gestión!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ' + text,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.gestionService.actualizarEstadoGestion(item.codGestion, s).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('',
                res.mensaje,
                'success'
              );
              this.listarGestiones();
            }
            this.spinner.hide();
          },
          err => this.spinner.hide()
        );
      }
    });
  }
}
