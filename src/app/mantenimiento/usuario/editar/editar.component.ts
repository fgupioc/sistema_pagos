import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UsuarioService} from '../../../servicios/sistema/usuario.service';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {TreeviewConfig, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {DefaultTreeviewI18n} from '../../../../lib/default-treeview-i18n';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
  providers: [
    {provide: TreeviewI18n, useClass: DefaultTreeviewI18n}
  ]
})
export class UsuarioEditarComponent implements OnInit {
  usuarioId = 0;
  public formGroup: FormGroup;
  tiposUsuarios = [];
  estados = [];
  datePipe = new DatePipe('es-PE');

  loading = false;
  items: TreeviewItem[];
  valoresMenus: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private usuarioService: UsuarioService, private maestroService: MaestroService, private menuService: MenuService) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      fechaInicioSesion: ['', [Validators.required]],
      fechaFinSesion: ['', [Validators.required]],
      codTipoUsuario: ['', [Validators.required]],
      codEstado: ['', [Validators.required]],
      inicioCierre: ['', [Validators.required]],
    });
    this.listarTiposDeUsuarios();
    this.listarEstadosDeRegistro();
    this.encuentraTodosArbol();
    this.obtenerUsuario();
  }

  onFilterChange(value: string) {
    console.log('filter:', value);
  }

  obtenerUsuario() {
    setTimeout(() => this.spinner.show());
    this.usuarioService.obtenerUsuario(this.usuarioId).subscribe(usuario => {
      this.spinner.hide();
      this.formGroup.get('usuario').setValue(usuario.usuario);
      this.formGroup.get('fechaInicioSesion').setValue(this.datePipe.transform(usuario.fechaFinSesion, 'yyyy-MM-dd'));
      this.formGroup.get('fechaFinSesion').setValue(this.datePipe.transform(usuario.fechaFinSesion, 'yyyy-MM-dd'));
      this.formGroup.get('codTipoUsuario').setValue(usuario.codTipoUsuario);
      this.formGroup.get('codEstado').setValue(usuario.codEstado);
      this.formGroup.get('inicioCierre').setValue(usuario.inicioCierre);
    });
  }

  encuentraTodosArbol() {
    this.loading = true;
    this.menuService.encuentraTodosArbol(this.usuarioId).subscribe(usuario => {
      this.loading = false;
      this.items = usuario.map(value => {
        return new TreeviewItem(value);
      });
    });
  }

  listarTiposDeUsuarios() {
    this.maestroService.listarTiposDeUsuarios().subscribe(res => this.tiposUsuarios = res);
  }

  listarEstadosDeRegistro() {
    this.maestroService.listarEstadosDeRegistro().subscribe(res => this.estados = res);
  }

  saveUsuario() {
    const usuario = {
      id: this.usuarioId,
      usuario: this.formGroup.get('usuario').value,
      fechaInicioSesion: this.formGroup.get('fechaInicioSesion').value,
      fechaFinSesion: this.formGroup.get('fechaFinSesion').value,
      codTipoUsuario: this.formGroup.get('codTipoUsuario').value,
      codEstado: this.formGroup.get('codEstado').value,
      inicioCierre: this.formGroup.get('inicioCierre').value,
    };
    const usuarioActualizar = {
      usuario,
      valoresMenus: this.valoresMenus
    };
    this.spinner.show();
    this.usuarioService.actualizar(usuarioActualizar).subscribe(
      respuesta => {
        if (respuesta.exito) {
          this.toastr.success(respuesta.mensaje, '');
          this.activeModal.close(true);
        } else {
          Swal.fire('', respuesta.mensaje, 'error');
        }

        this.spinner.hide();
      }
    );
  }

  buscarUsuarioPorId() {

  }


}
