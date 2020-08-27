import {Component, OnInit} from '@angular/core';
import {AsignacionCarteraService} from '../../servicios/asignacion-cartera.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Cartera, Etapa, Gestion} from '../../interfaces/cartera';
import {isNullOrUndefined} from 'util';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import Swal from 'sweetalert2';
import {NgWizardConfig, NgWizardService, StepChangedArgs, THEME} from 'ng-wizard';
import {MultiSelect} from '../cartera/detalle-cartera/detalle-cartera.component';
import {TablaMaestra} from '../../interfaces/tabla-maestra';
import {CONST} from '../../comun/CONST';

@Component({
  selector: 'app-asignacion-carter',
  templateUrl: './asignacion-cartera.component.html',
  styles: []
})
export class AsignacionCarteraComponent implements OnInit {
  ejecutivos: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.listarEjecutivos();
  }


  listarEjecutivos() {
    this.asignacionService.listarEjecutivos().subscribe(
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

  showCarteras(ejecutivo: any, event?: Event) {

  }
}
