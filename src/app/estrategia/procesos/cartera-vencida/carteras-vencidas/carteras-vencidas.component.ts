import {Component, OnInit, ViewChild} from '@angular/core';
import { CreditoTemp } from '../../../../interfaces/credito-temp';
import { TablaMaestra } from '../../../../interfaces/tabla-maestra';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExtrajudicialService } from '../../../../servicios/recuperacion/extrajudicial.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaestroService } from '../../../../servicios/sistema/maestro.service';
import { AsignacionCarteraService } from '../../../../servicios/asignacion-cartera.service';
import { CONST } from 'src/app/comun/CONST';
import { ToastrService } from 'ngx-toastr';
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";

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

  dtOptions: DataTables.Settings = CONST.DATATABLE_ES();
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

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
      desde: [{value:0, disabled: true}],
      hasta: [],
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
    this.asignacionService.getCarterasConUltimaEtapaCobranza().subscribe(
      res => {
        this.carteras = res ;
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
    const { filtro, cartera, gestor, desde, hasta} = this.formGroup.getRawValue();
    if ((filtro == '1' && !cartera) || (filtro == '1' && cartera.length == 0)) {
      this.toastr.warning('Debe seleccionar una cartera.');
      return;
    }

    if ((filtro == '2' && !gestor) || (filtro == '2' && gestor.length == 0)) {
      this.toastr.warning('Debe seleccionar una gestor.');
      return;
    }


    if (filtro == '1' && Number(desde) > 0 && Number(hasta) > 0 && Number(desde) >= Number(hasta)) {
      this.toastr.warning('El día fin no puede ser menor al día de inicio.');
      return;
    }

    if (filtro == '1' && Number(desde) == 0 && Number(hasta) > 0 ) {
      this.toastr.warning('El día inicio es obligatorio.');
      return;
    }

    if (filtro == '1' && cartera && cartera.length > 0) {
      this.spinner.show();
      this.asignacionService.buscarCreditosVencidosPorCartera(cartera, desde, hasta > 0 ? hasta : null).subscribe(
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
      this.spinner.show();
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
    this.formGroup.controls.desde.setValue('');
    this.formGroup.controls.hasta.setValue('');
    this.creditos = [];
  }

  changecartera(event: any) {
    const item = this.carteras.find(i => i.codCartera == event);
    this.formGroup.controls.desde.setValue(0);
    if (item){
      this.formGroup.controls.desde.setValue(item.hasta);
    }
    this.creditos = [];
  }
}
