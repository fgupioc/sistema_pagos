import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarGestionComponent } from '../../gestion/actualizar-gestion/actualizar-gestion.component';
import { Router } from '@angular/router';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-cartera',
  templateUrl: './crear-cartera.component.html',
  styleUrls: ['./crear-cartera.component.css']
})
export class CrearCarteraComponent implements OnInit {
  formulario: FormGroup;
  cartera: any;
  gestiones: any[];

  constructor(
    private router: Router,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
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
      codMoneda: [{value: ''}, [Validators.required]],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}]
    });
  }

  getCartera() {
    this.carteraService.carteraAbaco().subscribe(
      response => {
        if (response.exito) {
          this.cartera = response.objeto;
          this.formulario.setValue(this.cartera);
        }
      }
    );
  }

  getGestiones() {
    this.spinner.show();
    this.carteraService.getGestiones('1').subscribe(
      response => {
        if (response.exito) {
          console.log(response.objeto)
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
    const data = this.formulario.getRawValue();
    console.log(data);
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
}
