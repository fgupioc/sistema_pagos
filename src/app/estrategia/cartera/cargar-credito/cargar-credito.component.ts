import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CarteraCargarCreditoFileComponent } from "./file/file.component";
import { CreditoService } from "../../../servicios/estrategia/credito.service";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { CarteraService } from "../../../servicios/estrategia/cartera.service";
import { S } from '../../../comun/autorzacion';

@Component({
  selector: "app-cargar-credito",
  templateUrl: "./cargar-credito.component.html",
  styleUrls: ["./cargar-credito.component.css"],
})
export class CarteraCargarCreditoComponent implements OnInit {
  cargas = [];
  cabeceras = [];
  carterasActivas = [];
  carteraId: number;

  constructor(
    private modalService: NgbModal,
    private creditoService: CreditoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private carteraService: CarteraService
  ) {}

  ngOnInit() {
    this.listarCarterasActivas();
  }

  listarCargas() {
    this.spinner.show();
    this.creditoService.listarCargas(this.carteraId).subscribe((res) => {
      this.spinner.hide();
      this.cabeceras = [];

      this.cargas = res.cargas;
    });
  }

  quieresResetear() {
    Swal.fire({
      text: "Quieres Resetear",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "btn-primary",
      confirmButtonText: "Si, Resetear!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.resetear();
      }
    });
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

  resetear() {
    this.spinner.show();
    this.creditoService.resetear().subscribe((result) => {
      this.spinner.hide();
      if (result.exito) {
        this.toastr.success(result.mensaje);
        this.listarCargas();
      } else {
        Swal.fire("", result.mensaje, "error");
      }
    });
  }

  cargarArchivo() {
    const modal = this.modalService.open(CarteraCargarCreditoFileComponent, {
      centered: true,
    });
    modal.result.then(this.modalClose.bind(this), this.modalClose.bind(this));
  }

  modalClose(response) {
    if (response) {
      this.listarCargas();
    }
  }

  quieresEjecutarCarga() {
    Swal.fire({
      text: "Quieres Ejecutar la Carga",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "btn-primary",
      confirmButtonText: "Si, Ejecutar Carga!",
      cancelButtonText: "Cancelar",
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
      this.carteraService.cargarCreditosCartera(carteraId).subscribe(
        res => {
          console.log(res);
          this.spinner.hide();
          Swal.fire('Cargar Créditos',`<b>Total de Créditos: </b> ${res.creditos} </br> <b>Créditos Nuevos: </b> ${res.creditosNew} </br> <b>Créditos Actualizados: </b> ${res.creditosUpdate} </br>`, 'success')
        },
        err => {
          this.spinner.hide();
          Swal.fire('', 'Ocurrio un error en el proceso de carga...', 'error');
        }
      )
    }

  }
}
