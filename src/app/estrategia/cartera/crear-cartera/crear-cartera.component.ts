import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarGestionComponent } from '../../gestion/actualizar-gestion/actualizar-gestion.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-cartera',
  templateUrl: './crear-cartera.component.html',
  styleUrls: ['./crear-cartera.component.css']
})
export class CrearCarteraComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
