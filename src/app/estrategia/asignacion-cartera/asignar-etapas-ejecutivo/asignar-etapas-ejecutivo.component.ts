import {Component, OnInit} from '@angular/core';
import {Cartera} from '../../../interfaces/cartera';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-asignar-etapas-ejecutivo',
  templateUrl: './asignar-etapas-ejecutivo.component.html',
  styles: []
})
export class AsignarEtapasEjecutivoComponent implements OnInit {
  cartera: Cartera;
  ejecutivoId: string;
  nombre: string;
  ejecutivo: any;

  /*******************/
  items: TreeviewItem[];
  values: number[];
  campoValues: string[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  campos: TreeviewItem[];
  /************************************/
  constructor(
    private spinner: NgxSpinnerService,
    private asignacion: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    activatedRoute.params.subscribe(({nombre, ejecutivoId}) => {
      if (ejecutivoId && nombre) {
        const state = router.getCurrentNavigation().extras.state;
        if (state) {
          this.cartera = state.cartera;
          this.items = this.asignacion.convertToTreeviewItem(this.cartera);
          this.listarCamposByCartera(this.cartera.codCartera);
          this.ejecutivo = state.user;
        } else {
          this.ejecutivoId = ejecutivoId;
          this.nombre = nombre;
        }
      } else {
        this.router.navigateByUrl('/auth/estrategia/carteras');
      }
    });
  }

  ngOnInit() {
    if (this.ejecutivoId && this.nombre) {
      this.buscarEjecutivoByCodUsuario(this.ejecutivoId);
      this.getCartera(this.nombre);
    }
  }

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }


  getCartera(nombre) {
    this.spinner.show();
    this.asignacion.getCartera(nombre).subscribe(
      res => {
        if (res.exito) {
          this.cartera = res.objeto as any;
          this.listarCamposByCartera(this.cartera.codCartera);
          this.items = this.asignacion.convertToTreeviewItem(this.cartera);
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  selectItem(event: any[]) {
    console.log(event);
    this.values = event;
  }

  listarCamposByCartera(codCartera) {
    this.asignacion.listarCamposByCartera(codCartera).subscribe(
      res => {
        const items: any[] = res.objeto as any[];
        this.campos = this.asignacion.convertCamposToTreeviewItem(items, this.cartera.codCartera);
      }
    );
  }

  private buscarEjecutivoByCodUsuario(ejecutivoId: string) {
    this.asignacion.buscarEjecutivoByCodUsuario(ejecutivoId).subscribe(
      res => {
        if (res.exito) {
           this.ejecutivo = res.objeto;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  onFilterChangeCampos(value: string) {
    console.log('filter:', value);
  }

  selectItemCampos(event: any[]) {
    console.log(event);
    this.campoValues = event;
  }
}
