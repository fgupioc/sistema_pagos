import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../servicios/sistema/usuario.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioEditarComponent} from './editar/editar.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService, private spinner: NgxSpinnerService, private modalService: NgbModal,) {
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

  modalUserEdit(usuarioId: number) {
    const modal = this.modalService.open(UsuarioEditarComponent, {centered: true});
    modal.result.then(
      this.modalClose.bind(this),
      this.modalClose.bind(this)
    );
    modal.componentInstance.usuarioId = usuarioId;
  }

  modalClose(response) {
    if (response) {
      this.encuentraTodos();
    }
  }
}
