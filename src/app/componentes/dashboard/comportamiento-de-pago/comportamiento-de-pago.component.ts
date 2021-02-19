import { Component, OnInit } from '@angular/core';
import { TablaMaestra } from '../../../interfaces/tabla-maestra';
import { MaestroService } from '../../../servicios/sistema/maestro.service';

@Component({
  selector: 'app-comportamiento-de-pago',
  templateUrl: './comportamiento-de-pago.component.html',
  styleUrls: ['./comportamiento-de-pago.component.css']
})
export class ComportamientoDePagoComponent implements OnInit {
  productos: TablaMaestra[] = [];
  constructor(
    private maestroService: MaestroService,
  ) { }

  ngOnInit() {
    this.listarProductosAbaco();
  }

  private listarProductosAbaco() {
    this.maestroService.listaTablaProductoAbaco().subscribe(
      res => {
        this.productos = res;
      }
    );
  }
}
