import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AsignacionCarteraService } from '../../../servicios/asignacion-cartera.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditoTemp } from 'src/app/interfaces/credito-temp';

@Component({
  selector: 'app-creditos-vencidos',
  templateUrl: './creditos-vencidos.component.html',
  styleUrls: ['./creditos-vencidos.component.css']
})
export class CreditosVencidosComponent implements OnInit {
  asignacionUuid: string;
  ejecutivoUuid: string;
  creditos: CreditoTemp[] = [];

  creditosSeleccionados: CreditoTemp[] = [];

  constructor(
    private router: ActivatedRoute,
    private asignacionCarteraService: AsignacionCarteraService,
    private spinner: NgxSpinnerService
  ) {
    const {ejecutivoUuid} = router.snapshot.params;
    this.ejecutivoUuid = ejecutivoUuid;
    this.loadCreditos(ejecutivoUuid);
  }

  ngOnInit() {
  }

  seleccionarTodos(event: any) {
    this.creditosSeleccionados = [];
    if (event.target.checked) {
      this.creditosSeleccionados = this.creditos;
    }
  }

  seleccionado(credito: CreditoTemp) {
    return this.creditosSeleccionados.find(i => i.id == credito.id);
    ;
  }

  seleccionarCredito(event: any, credito: CreditoTemp) {

    if (event.target.checked) {
      const item = this.creditosSeleccionados.find(i => i.id == credito.id);
      if (!item) {
        this.creditosSeleccionados.push(credito);
      }
    } else {
      this.creditosSeleccionados = this.creditosSeleccionados.filter(i => i.id != credito.id);
    }

    console.log(this.creditosSeleccionados);
  }

  loadCreditos(uuid) {
    this.spinner.show();
    this.asignacionCarteraService.creditosVencidosPorEjecutivo(uuid).subscribe(
      res => {
        if (res.exito) {
          this.creditos = res.creditos;
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }
}
