import {Component, OnInit} from '@angular/core';
import {AsignacionCarteraService} from '../../servicios/asignacion-cartera.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Cartera} from '../../interfaces/cartera';
import {isNullOrUndefined} from 'util';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignacion-carter',
  templateUrl: './asignacion-cartera.component.html',
  styles: []
})
export class AsignacionCarteraComponent implements OnInit {
  cartera: Cartera;
  nombre: string;
  ejecutivos: any[] = [];
  items: TreeviewItem[];

  constructor(
    private spinner: NgxSpinnerService,
    private asignacion: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    activatedRoute.params.subscribe(({nombre}) => {
      if (nombre) {
        const state = router.getCurrentNavigation().extras.state;
        if (state) {
          this.cartera = state.cartera;
          this.items = this.asignacion.convertToTreeviewItem(this.cartera);

        } else {
          this.nombre = nombre;
        }

      } else {
        this.router.navigateByUrl('/auth/estrategia/carteras');
      }
    });
  }

  ngOnInit() {
    this.listarEjecutivos();
    if (this.nombre) {
      this.getCartera(this.nombre);
    }
  }

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  listarEjecutivos() {
    this.asignacion.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getCartera(nombre) {
    this.spinner.show();
    this.asignacion.getCartera(nombre).subscribe(
      res => {
        if (res.exito &&  res.objeto) {
          this.cartera = res.objeto as any;
          this.items = this.asignacion.convertToTreeviewItem(this.cartera);
        } else {
          Swal.fire('Asignar', 'No se encontro la cartera o esta desactivada.', 'warning');
          this.router.navigateByUrl('/auth/estrategia/carteras');
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  irAsignarEtapasEjecutivo(item: any) {
    this.router.navigateByUrl('/auth/estrategia/carteras/' + this.cartera.nombreExterno + '/asignacion/' + item.codUsuario + '/etapas', {state: {user: item, cartera: this.cartera}});
  }

  irEjecutivoCreditos(item: any) {
    this.router.navigateByUrl('/auth/estrategia/carteras/' + this.cartera.nombreExterno + '/asignacion/' + item.codUsuario + '/creditos', {state: {user: item, cartera: this.cartera}});
  }
}
