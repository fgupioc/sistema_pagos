import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EjecutivoCartera} from '../../../models/ejecutivo-cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-modal-agregar-credito',
  templateUrl: './modal-agregar-credito.component.html',
  styleUrls: ['./modal-agregar-credito.component.css']
})
export class ModalAgregarCreditoComponent implements OnInit {
  data: EjecutivoCartera = {
    codUsuario: null,
    cartera: null,
    etapaItems: [],
    campoItems: [],
    sociosOpcional: [],
    creditosAsignados: [],
    startDate: null,
    endDate: null,
    frecuencia: null
  };
  $creditos: any[] = [];
  $creditosCheched: any[] = [];
  creditosAsignacion: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 100);
    if (this.data.cartera.codCartera) {
      const data = this.data;
      data.creditosAsignados = [];
      data.sociosOpcional = [];
      this.asignacionService.buscarCreditosPorFiltro(data.cartera.codCartera, data).subscribe(
        res => {
          this.$creditos = res;
          this.spinner.hide();
        },
        err => this.spinner.hide()
      );
    }
    console.log(this.creditosAsignacion);
  }

  changeCheckCreditos(event: any, credito: any) {
    const exist = this.$creditosCheched.find(i => i.id == credito.id);
    if (event.target.checked) {
      if (!exist) {
        this.$creditosCheched.push(credito);
      }
    } else {
      this.$creditosCheched = this.$creditosCheched.filter(i => i.id != credito.id);
    }
    console.log(this.$creditosCheched);
  }

  existe(credito: any) {
    return this.creditosAsignacion.find(i => i.id == credito.id);
  }
}
