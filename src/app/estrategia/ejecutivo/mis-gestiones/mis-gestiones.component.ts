import { Component, OnInit } from '@angular/core';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-mis-gestiones',
  templateUrl: './mis-gestiones.component.html',
  styleUrls: ['./mis-gestiones.component.css']
})
export class MisGestionesComponent implements OnInit {
  creditos: any[] = [];
  constructor(
    private gestionAdministrativaService: GestionAdministrativaService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.listarCreditos();
  }

  private listarCreditos() {
    this.spinner.show();
    this.gestionAdministrativaService.listarCreditosAsignadosPorEjecutivo().subscribe(
      res => {
        if (res.exito) {
          this.creditos = res.objeto as any[];
        }
        this.spinner.hide();
      }
    );
  }
}
