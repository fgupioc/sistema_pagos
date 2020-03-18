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
    /*
    if (response !== undefined && response === Object(response)) {
      this.usuarios = [];
      const createMode: boolean = response.createMode;
      const responseStatus: ResponseStatus = response.responseStatus;
      if (responseStatus.descripcion == AppConstante.C_STR_ERROR_DESCRIPCION_EXITO) {
        if (createMode) {
          this.toastr.success('El usuario fue registrado con éxito');
        } else {
          this.toastr.success('El usuario fue actualizado con éxito');
        }
        this.loadData();
      }
    }
    */
  }
}
