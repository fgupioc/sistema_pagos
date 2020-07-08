import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {Cartera} from '../../../interfaces/cartera';
import {isNullOrUndefined} from 'util';
import {FUNC} from '../../../comun/FUNC';

declare var $: any;


@Component({
  selector: 'app-crear-cartera',
  templateUrl: './crear-cartera.component.html',
  styleUrls: ['./crear-cartera.component.css']
})
export class CrearCarteraComponent implements OnInit {
  formulario: FormGroup;
  // cartera: Cartera;
  gestiones: any[] = [];
  monedas: any[] = [];
  monedasSeleccionadas: any[] = [];

  constructor(
    private router: Router,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) {
  }

  ngOnInit() {
    this.listarMondas();

    this.formulario = this.formBuilder.group({
      codCartera: [''],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      nombreExterno: [{value: '', disabled: true}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      diasDeudaSinVencer: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      horaInicio: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      horaFin: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      compromisoDesde: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      compromisoHasta: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      diasGestion: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      monedas: [],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}]
    });
  }

  listarMondas() {
    this.spinner.show();
    this.maestroService.listarMondas().subscribe(
      res => {
        this.monedas = res;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  guardar() {
    if (this.formulario.invalid) {
      Swal.fire('Cartera', 'Debe ingresar los datos necesario.', 'error');
      return;
    }

    if (this.monedasSeleccionadas.length == 0) {
      Swal.fire('Cartera', 'Debe seleccionar un tipo de monesa.', 'error');
      return;
    }
    const data = this.formulario.getRawValue();
    data.monedas = this.convert();
    data.nombreExterno = FUNC.generateSlug(data.nombre);
    this.spinner.show();
    this.carteraService.crearCartera(data).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('Actualizar Cartera', 'Se actualizó la cartera correctamente.', 'success');
          const cart: Cartera = res.objeto as Cartera;
          this.router.navigate(['/auth/estrategia/carteras/crear-gestion'], {state: {create: true, cartera: cart, gestiones: []}});
        } else {
          this.toastr.error('Ocurrio un error.', 'Actualizar Cartera');
        }
        this.spinner.hide();
      }
    );
  }

  convert() {
    const array = [];
    if (this.monedasSeleccionadas.length > 0) {
      this.monedasSeleccionadas.forEach(e => {
        array.push({
          codCartera: null,
          codMoneda: e.codItem
        });
      });
    }
    return array;
  }

  cambioMoneda(event: any, item: any) {
    const index = this.monedasSeleccionadas.findIndex(v => v.codItem == item.codItem);

    if (event.target.checked) {
      if (index == -1) {
        this.monedasSeleccionadas.push(item);
      }
    } else {
      console.log(index);
      if (index >= 0) {
        this.monedasSeleccionadas.splice(index, 1);
      }
    }
  }

  selecciodano(item: any) {
    const obj = this.monedasSeleccionadas.find(v => v.codItem == item.codItem);
    return !!obj;
  }

  cambio(tipo: any) {
    if (tipo == '1') {
      $('.gestion').removeClass('active');
      $('.cartera').addClass('active');
      $('#gestion').removeClass('show active');
      $('#cartera').addClass('show active');
    } else {
      $('.cartera').removeClass('active');
      $('.gestion').addClass('active');
      $('#gestion').addClass('show active');
      $('#cartera').removeClass('show active');
    }
  }

  generateCode(event: any) {
    const value = event.target.value;
    this.formulario.controls.nombreExterno.setValue(FUNC.generateSlug(value));
  }
}
