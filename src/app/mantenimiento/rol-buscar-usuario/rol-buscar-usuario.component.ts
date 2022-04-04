import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Usuario} from '../../interfaces/Usuario';
import {Router} from '@angular/router';
import {UsuarioService} from '../../servicios/sistema/usuario.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CONST} from '../../comun/CONST';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol-buscar-usuario',
  templateUrl: './rol-buscar-usuario.component.html',
  styleUrls: ['./rol-buscar-usuario.component.css']
})
export class RolBuscarUsuarioComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  formulario: FormGroup;
  usuarios: Usuario[] = [];
  listaUsuarios: Usuario[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      nombre: [null]
    });
    this.buscarIni();
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
  }

  buscarUsuarios() {
    this.listaUsuarios = [];
    this.spinner.show();
    this.buscarIni();
  }

  buscarIni() {
    const element = document.getElementById('collapseUno');
    const element2 = document.getElementById('collapseDos');
    const container = document.getElementById('container_documents');
    element.classList.add('show');
    element2.classList.remove('show');
    container.classList.add('hidden-i');
    const nombre = this.formulario.controls.nombre.value || '';
    this.usuarioService.buscarParaAgregarAlRol(nombre).subscribe(
      response => {
        if (response.codigo == CONST.C_STR_CODIGO_SUCCESS) {
          this.usuarios = response.objeto as any;
          if (this.usuarios.length > 0) {
            container.classList.remove('hidden-i');
            element.classList.remove('show');
            element2.classList.add('show');
          }
        } else {
          Swal.fire('Buscar Usuarios', 'Ocurrio un error', 'error');
          element.classList.add('show');
          element2.classList.remove('show');
          container.classList.add('hidden-i');
        }
        this.spinner.hide();
      });
  }

  seleccionarUsuario(event: any, item: Usuario) {
    const index = this.listaUsuarios.findIndex(value => value.id == item.id);
    if (event.target.checked) {
      if (index < 0) {
        this.listaUsuarios.push(item);
      }
    } else {
      if (index >= 0) {
        this.listaUsuarios.splice(index, 1);
      }
    }
  }

  aceptar() {
    if (this.listaUsuarios.length > 0) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se agregará a la lista de los usuarios para el rol.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Agregar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.activeModal.dismiss(this.listaUsuarios);
        }
      });
    }
  }

}
