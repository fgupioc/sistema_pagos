import { FUNC } from './../../../comun/FUNC';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { AsignacionCarteraService } from '../../../servicios/asignacion-cartera.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditoTemp } from '../../../interfaces/credito-temp';
import { SocioArchivo } from 'src/app/interfaces/socio/socio-archivo';

@Component({
  selector: 'app-credito-vencido',
  templateUrl: './credito-vencido.component.html',
  styleUrls: ['./creditos-vencidos.component.css']
})
export class CreditoVencidoComponent implements OnInit {
  asignacionUuid: string;
  ejecutivoUuid: string;
  nroCredito: string;
  credito: CreditoTemp;
  fileName: any;
  file: any;
  archivos: SocioArchivo[] = [
    { id: 1, nombre: 'Solicitud', fechaRegistro: new Date() },
    { id: 2, nombre: 'Contrato', fechaRegistro: new Date() },
    { id: 3, nombre: 'Pagares y garantias', fechaRegistro: new Date() },
    { id: 4, nombre: 'Cronograma', fechaRegistro: new Date() },
  ];

  constructor(
    private router: ActivatedRoute,
    private asignacionCarteraService: AsignacionCarteraService,
    private spinner: NgxSpinnerService
  ) {
    const {ejecutivoUuid, nroCredito} = router.snapshot.params;
    this.ejecutivoUuid = ejecutivoUuid;
    this.nroCredito = nroCredito;
    this.loadCredito(ejecutivoUuid, nroCredito);
  }

  ngOnInit() {
  }

  loadCredito(ejecutivoUuid, nroCredito) {
    this.spinner.show();
    this.asignacionCarteraService.buscarCreditoVencidosPorEjecutivo(ejecutivoUuid, nroCredito).subscribe(
      res => {
        if (res.exito) {
          this.credito = res.credito;
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  subirArchivo(labelInput: any) {
    if (this.file) {
      this.archivos.push({
        id: this.archivos.length + 1,
        nombre: this.fileName ? (this.fileName.trim().length > 0 ? this.fileName : this.file.name ) : this.file.name,
        fechaRegistro: new Date(),
        extencion: FUNC.getFileExtension(this.file.name)
      });
      document.getElementById(labelInput.id).innerHTML = 'Buscar archivo';
      this.fileName = '';
    }

  }

  changeArchivo(event: any, labelInput: any) {
    if (event.target.files[0]) {
      this.file = event.target.files[0];
      document.getElementById(labelInput.id).innerHTML = event.target.files[0].name;
    }
  }
}
