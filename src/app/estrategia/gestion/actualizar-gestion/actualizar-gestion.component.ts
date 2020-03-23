import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';

@Component({
  selector: 'app-actualizar-gestion',
  templateUrl: './actualizar-gestion.component.html',
  styleUrls: ['./actualizar-gestion.component.css']
})
export class ActualizarGestionComponent implements OnInit {
  formGestion: FormGroup;
  campos: any[];

  constructor(
    private formBuilder: FormBuilder,
    private carteraService: CarteraService
  ) { }

  ngOnInit() {
    this.formGestion = this.formBuilder.group({
      codGestion: [''],
      codCartera: [''],
      codCampoCartera: [''],
      nombre: [''],
      grupo: [''],
      desde: [''],
      hasta: [''],
      fechaCreacion: [''],
      fechaActualizacion: [''],
      userCreate: [''],
      userUpdate: [''],
      estado: [''],
    });
  }

  getCampos() { 
  }
}
