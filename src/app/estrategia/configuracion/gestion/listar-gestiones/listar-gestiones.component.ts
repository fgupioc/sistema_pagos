import {Component, OnInit} from '@angular/core';
import {GestionService} from '../../../../servicios/estrategia/gestion.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';

@Component({
  selector: 'app-listar-gestiones',
  templateUrl: './listar-gestiones.component.html',
  styleUrls: ['./listar-gestiones.component.css']
})
export class ListarGestionesComponent implements OnInit {
  gestiones: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private gestionService: GestionService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.listarGestiones();
  }

  listarGestiones() {
    this.spinner.show();
    this.gestionService.listarActivos().subscribe(
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

  }
}
