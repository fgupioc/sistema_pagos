import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CarteraCargarCreditoFileComponent} from './file/file.component';
import {CreditoService} from '../../../servicios/estrategia/credito.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {Autorizacion, S} from '../../../comun/autorzacion';
import {MenuService} from '../../../servicios/sistema/menu.service';
import * as moment from 'moment';

@Component({
  selector: 'app-cargar-credito',
  templateUrl: './cargar-credito.component.html',
  styleUrls: ['./cargar-credito.component.css'],
})
export class CarteraCargarCreditoComponent implements OnInit {
  cargas = [];
  cabeceras = [];
  carterasActivas = [];
  carteraId: number;
  fechaCarga: string;
  A = Autorizacion;

  constructor(
    private modalService: NgbModal,
    private creditoService: CreditoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private carteraService: CarteraService,
    public menuS: MenuService
  ) {
  }

  ngOnInit() {
    if (this.menuS.hasShowCargaManual(this.A.CARGA_MANUAL_CARGAR)) {
      this.listarCarterasActivas();
    }
    this.getUltimoDiaMesAnterior();
  }

  private listarCarterasActivas() {
    this.spinner.show();
    this.carteraService.activas().subscribe((res) => {
      this.spinner.hide();
      this.carterasActivas = res;
      this.actualizar();
    });
  }

  actualizar() {

  }

  quieresEjecutarCarga() {
    Swal.fire({
      text: 'Quieres Ejecutar la Carga',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'btn-primary',
      confirmButtonText: 'Si, Ejecutar Carga!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.ejecutarCarga();
      }
    });
  }

  ejecutarCarga() {
    const carteraId = this.carteraId;
    this.spinner.show();
    if (carteraId) {
      this.carteraService.cargarCreditosCartera(carteraId, moment(this.fechaCarga).format('DD/MM/YYYY')).subscribe(
        res => {
          this.spinner.hide();
          Swal.fire('Cargar Créditos', `<b>Total de Créditos: </b> ${res.creditos} </br> <b>Créditos Nuevos: </b> ${res.creditosNew} </br> <b>Créditos Actualizados: </b> ${res.creditosUpdate} </br>`, 'success');
          this.carteraService.cargarSociosSinDatos();
        },
        ({error: {message}}) => {
          this.spinner.hide();
          Swal.fire('Cargar Créditos', message ? message : 'Ocurrió un error en el proceso de carga...', 'error');
        }
      );
    }

  }

  getUltimoDiaMesAnterior() {
    const date = moment().subtract(1, 'month');
    this.fechaCarga = date.endOf('month').format('YYYY-MM-DD');
  }
}
