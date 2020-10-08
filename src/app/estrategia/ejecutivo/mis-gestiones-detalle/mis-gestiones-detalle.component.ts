import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GestionAdministrativaService} from '../../../servicios/gestion-administrativa.service';
import {Credito} from '../../../interfaces/credito';
import {FUNC} from '../../../comun/FUNC';
import {Cartera, Etapa} from '../../../interfaces/cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {Persona} from '../../../interfaces/Persona';
import {CONST} from '../../../comun/CONST';

@Component({
  selector: 'app-mis-gestiones-detalle',
  templateUrl: './mis-gestiones-detalle.component.html',
  styleUrls: ['./mis-gestiones-detalle.component.css']
})
export class MisGestionesDetalleComponent implements OnInit {
  creditoId: any;
  credito: Credito;
  cartera: Cartera;
  funciones = FUNC;
  socio: Persona;
  etapa: Etapa;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private gestionAdministrativaService: GestionAdministrativaService
  ) {
    activatedRoute.params.subscribe(({creditoId}) => this.creditoId = creditoId);
  }

  ngOnInit() {
    if (this.creditoId) {
      this.loadCredito();
    }
  }

  loadCredito() {
    this.spinner.show();
    this.gestionAdministrativaService.buscarCreditoPorId(this.creditoId).subscribe(
      res => {
        if (res.exito) {
          this.credito = res.credito;
          this.cartera = res.cartera;
          this.socio = res.socio;
          this.etapa = res.etapa;
          setTimeout(() => this.spinner.hide(), 3000);
        } else {
          Swal.fire('Credito', res.mensaje, 'error');
          this.router.navigateByUrl('/auth/gestion-administrativa/mis-gestiones');
        }
      },
      err => {
        this.spinner.hide();
        Swal.fire('Credito', 'Ocurrio un error', 'error');
        this.router.navigateByUrl('/auth/gestion-administrativa/mis-gestiones');
      }
    );
  }

  get typeDocumentDescription() {
    if (this.socio) {
      if (this.socio.personaNatural) {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_DNI);
        return docmento ? docmento.tipoDocumentoDescripcion : '';
      } else {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_RUC);
        return docmento ? docmento.tipoDocumentoDescripcion : '';
      }
    } else {
      return '';
    }
  }

  get documentNumber() {
    if (this.socio) {
      if (this.socio.personaNatural) {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_DNI);
        return docmento ? docmento.numeroDocumento : '';
      } else {
        const docmento = this.socio.documentosIdentidad.find(i => i.tipoDocumento == CONST.C_STR_TIPO_DOCUMENTO_RUC);
        return docmento ? docmento.numeroDocumento : '';
      }
    } else {
      return '';
    }
  }

  get regla() {
    if (this.etapa) {
      return `${this.etapa.nombre}(${this.etapa.desde} - ${this.etapa.hasta})`;
    } else {
      return '';
    }
  }
}
