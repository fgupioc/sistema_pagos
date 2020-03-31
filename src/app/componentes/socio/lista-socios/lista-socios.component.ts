import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-socios',
  templateUrl: './lista-socios.component.html',
  styleUrls: ['./lista-socios.component.css']
})
export class ListaSociosComponent implements OnInit {
  formulario: FormGroup;
  carteras: any[] = [];
  socios: any[] = [{}];

  constructor(
    config: NgbModalConfig,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal
  ) {
    config.backdrop = 'static',
    config.keyboard = false;
   }

  ngOnInit() {
    this.listarCartera();
    this.formulario = this.formBuilder.group({
      codCartera: ['', Validators.required]
    });
  }

  listarCartera() {
    this.spinner.show();
    this.carteraService.activas().subscribe(
      response => {
        this.carteras = response;
        this.spinner.hide();
      }
    );
  }

  cambioCartera() {
    const codCartera = this.formulario.controls.codCartera.value;
    this.spinner.show();
    if (!isNullOrUndefined(codCartera)) {
      this.carteraService.listarSocioPorCartera(codCartera).subscribe(
        response => {
          if (response.exito) {
            console.log(response.objeto);
          } else {
            Swal.fire('Lista Socios', response.mensaje, 'error');
          }
          this.spinner.hide();
        }
      );
    }
  }

}
