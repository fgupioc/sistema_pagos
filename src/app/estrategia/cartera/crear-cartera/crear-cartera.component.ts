import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarGestionComponent } from '../../gestion/actualizar-gestion/actualizar-gestion.component';
import { Router } from '@angular/router';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { FormGroup, FormBuilder } from '@angular/forms';

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
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getCartera();
    this.getGestiones();
    this.formulario = this.formBuilder.group({
      codCartera: [''],
      codigo: [{value: '', disabled: true}],
      nombre: [{value: '', disabled: true}],
      nombreExterno: [{value: '', disabled: true}],
      diasDeudaSinVencer: [{value: '', disabled: true}],
      horaInicio: [{value: '', disabled: true}],
      horaFin: [{value: '', disabled: true}],
      compromisoDesde: [{value: '', disabled: true}],
      compromisoHasta: [{value: '', disabled: true}],
      diasGestion: [{value: '', disabled: true}],
      codMoneda: [{value: '', disabled: true}],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}],
    });
  }

  getCartera() {
    this.carteraService.carteraAbaco().subscribe(
      response => {
        if (response.exito) { 
          this.cartera = response.objeto;
          this.formulario.setValue(this.cartera)
        }
      }
    );
  }

  getGestiones() {
    this.carteraService.getGestiones('1').subscribe(
      response => {
        if (response.exito) {
          console.log(response.objeto)
          this.gestiones = response.objeto;
        }
      }
    );
  }
}
