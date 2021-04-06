import {Component, OnInit} from '@angular/core';
import {AsignacionCarteraService} from '../../servicios/asignacion-cartera.service';
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-asignacion-carter',
  templateUrl: './asignacion-cartera.component.html',
  styles: []
})
export class AsignacionCarteraComponent implements OnInit {
  ejecutivos: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService
  ) {
  }

  ngOnInit() {
    this.listarEjecutivos();
  }


  listarEjecutivos() {
    this.spinner.show();
    this.asignacionService.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

}
