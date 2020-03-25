import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarGestionComponent } from '../../gestion/actualizar-gestion/actualizar-gestion.component';
import { Router } from '@angular/router';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MaestroService } from '../../../servicios/sistema/maestro.service';

@Component({
  selector: 'app-crear-cartera',
  templateUrl: './crear-cartera.component.html',
  styleUrls: ['./crear-cartera.component.css']
})
export class CrearCarteraComponent implements OnInit {
  formulario: FormGroup;
  cartera: any;
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
  ) { }

  ngOnInit() {
    this.listarMondas();
    this.getCartera();
    this.getGestiones();

    this.formulario = this.formBuilder.group({
      codCartera: [''],
      codigo: [{value: '', disabled: true}],
      nombre: [{value: ''}, [
        Validators.required,
        Validators.maxLength(100)
      ]],
      nombreExterno: [{value: ''}, [
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
    this.maestroService.listarMondas().subscribe(
      response => {
        this.monedas = response;
      }
    );
  }

  getCartera() {
    this.carteraService.carteraAbaco().subscribe(
      response => {
        if (response.exito) {
          this.cartera = response.objeto;
          console.log(this.cartera.monedas);
          this.formulario.setValue(this.cartera);
          if (this.cartera.monedas.length > 0) {
            this.cartera.monedas.forEach(e => {
              this.monedasSeleccionadas.push({
                codTabla: null,
                codItem: e.codMoneda,
                descripcion: null ,
                strValor: null,
                intValor: null,
                codEstado: null,
              });
            });
          }
        }
      }
    );
  }

  getGestiones() {
    this.spinner.show();
    this.carteraService.getGestiones('1').subscribe(
      response => {
        if (response.exito) {
          this.gestiones = response.objeto;
        }
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
    this.spinner.show();
    this.carteraService.actualizarCartera(data).subscribe(
      response => {
        if (response.exito) {
          this.getCartera();
          Swal.fire('Actualizar Cartera', 'Se actualizó la cartera correctamente.', 'success');
        } else {
          this.toastr.error('Ocurrio un error.', 'Actualizar Cartera')
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
          codCartera: this.cartera.codCartera,
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
      console.log(index)
      if (index >= 0) {
        this.monedasSeleccionadas.splice( index, 1 );
      } 
    }
    console.log(this.monedasSeleccionadas);
  }

  selecciodano(item: any) {
    const obj = this.monedasSeleccionadas.find(v => v.codItem == item.codItem);
    return obj ? true : false;
  }
}
