import { Component, OnInit } from '@angular/core';
import { CreditoTemp } from '../../../../interfaces/credito-temp';
import { TablaMaestra } from '../../../../interfaces/tabla-maestra';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExtrajudicialService } from '../../../../servicios/recuperacion/extrajudicial.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaestroService } from '../../../../servicios/sistema/maestro.service';
import { AsignacionCarteraService } from '../../../../servicios/asignacion-cartera.service';
import { CONST } from 'src/app/comun/CONST';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-carteras-vencidas',
  templateUrl: './carteras-vencidas.component.html',
  styles: []
})
export class CarterasVencidasComponent implements OnInit {
  formGroup: FormGroup;
  creditos: CreditoTemp[] = [];
  condiciones: TablaMaestra[] = [];
  ejecutivos: any[] = [];
  carteras: any[] = [];
  ejecutivo: any;

  constructor(
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private maestroService: MaestroService,
    private asignacionService: AsignacionCarteraService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listarEjecutivos();
    this.listarCarteras();
    this.formGroup = this.formBuilder.group({
      filtro: ['1'],
      cartera: [''],
      gestor: [''],
    });
  }

  listarEjecutivos() {
    this.asignacionService.listarEjecutivos().subscribe(
      res => {
        if (res.exito) {
          this.ejecutivos = res.objeto as any[];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  listarCarteras() {
    this.spinner.show();
    this.asignacionService.getCarteras().subscribe(
      res => {
        if (res.exito) {
          this.carteras = res.objeto as any[];
        }
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  buscar() {
    this.creditos = [];
    const { filtro, cartera, gestor} = this.formGroup.getRawValue();
    if ((filtro == '1' && !cartera) || (filtro == '1' && cartera.length == 0)) {
      this.toastr.warning('Debe seleccionar una cartera.');
      return;
    }

    if ((filtro == '2' && !gestor) || (filtro == '2' && gestor.length == 0)) {
      this.toastr.warning('Debe seleccionar una gestor.');
      return;
    }

    this.spinner.show();
    if (filtro == '1' && cartera && cartera.length > 0) {
      this.asignacionService.buscarCreditosVencidosPorCartera(cartera).subscribe(
        res => {
          if (res.exito) {
            this.creditos = res.creditos;
          }
          this.spinner.hide();
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      );
    }

    if (filtro == '2' && gestor && gestor.length > 0) {
      this.asignacionService.buscarCreditosVencidosPorEjecutivoId(gestor).subscribe(
        res => {
          if (res.exito) {
            this.creditos = res.creditos;
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

  changefiltro() {
    this.formGroup.controls.cartera.setValue('');
    this.formGroup.controls.gestor.setValue('');
    this.creditos = [];
  }
}
