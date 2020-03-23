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

  constructor(
    private router: Router,
    private carteraService: CarteraService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getCartera();
    this.formulario = this.formBuilder.group({
      codigo: [''],
      nombre: [''],
      nombreExterno: [''],
      diasDeudaSinVencer: [''],
      horaInicio: [''],
      horaFin: [''],
      compromisoDesde: [''],
      compromisoHasta: [''],
      diasGestion: [''],
      codMoneda: [''],
      fechaCreacion: [''],
      fechaActualizacion: [''],
      userCreate: [''],
      userUpdate: [''],
      estado: [''],
    });
  }

  getCartera() {
    this.carteraService.carteraAbaco().subscribe(
      response => {
        if (response.exito) {
          console.log(response.objeto)
          this.cartera = response.objeto;
          this.formulario.controls.codigo.setValue(this.cartera.codigo);
          this.formulario.controls.nombre.setValue(this.cartera.nombre);
          this.formulario.controls.nombreExterno.setValue(this.cartera.nombreExterno);
        }
      }
    );
  }
}
