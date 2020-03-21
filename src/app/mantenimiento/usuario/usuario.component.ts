import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../servicios/sistema/usuario.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CONST} from '../../comun/CONST';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService, private spinner: NgxSpinnerService, private modalService: NgbModal,
              private router: Router) {
  }

  ngOnInit() {
    this.encuentraTodos();
  }

  encuentraTodos() {
    this.spinner.show();
    this.usuarioService.encuentraTodos().subscribe(
      res => {
        this.spinner.hide();
        this.usuarios = res;
      });
  }

  crear() {
    this.router.navigate(['/auth/mantenimiento/usuario/crear']);
  }

  editar(usuarioId: number) {
    this.router.navigate(['/auth/mantenimiento/usuario/editar', usuarioId]);
  }


  estaActivo(codEstado: string) {
    return codEstado === CONST.S_ESTADO_REG_ACTIVO;
  }
}
