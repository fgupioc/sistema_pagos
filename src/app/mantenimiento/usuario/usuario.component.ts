import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../servicios/sistema/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private usuarioService: UsuarioService) {
  }

  ngOnInit() {
    this.encuentraTodos();
  }

  encuentraTodos() {
    this.usuarioService.encuentraTodos().subscribe(
      res => {
        // this.usuarios = res;
      });
  }
}
