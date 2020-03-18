import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class UsuarioEditarComponent implements OnInit {
  usuarioId = 0;
  userForm: FormGroup;
  tiposUsuarios = [];

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder,) {
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      usuario: ['', Validators.compose([
        Validators.required
      ])],
      fechaInicio: ['', Validators.compose([
        Validators.required
      ])],
      fechaFin: ['', Validators.compose([
        Validators.required
      ])],
      tipoUsuario: ['', Validators.compose([
        Validators.required
      ])],
      administraUsuario: ['', Validators.compose([
        Validators.required
      ])],
      usuarioActivo: ['', Validators.compose([
        Validators.required
      ])],
      cierreIniDia: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  saveUsuario() {

  }

  buscarUsuarioPorId() {

  }

}
