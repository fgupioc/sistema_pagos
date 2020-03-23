import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UsuarioService} from '../../../servicios/sistema/usuario.service';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {TreeviewConfig, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {DefaultTreeviewI18n} from '../../../../lib/default-treeview-i18n';
import {ActivatedRoute, Router} from '@angular/router';
import {CONST} from '../../../comun/CONST';
import {UsuarioUnicoService} from '../../../validaciones/usuario-unico.directive';

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

  cargandoMenu = false;
  items: TreeviewItem[];
  valoresMenus: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private usuarioUnicoService: UsuarioUnicoService,
              private toastr: ToastrService, private router: Router, private rutaActiva: ActivatedRoute,
              private usuarioService: UsuarioService, private maestroService: MaestroService, private menuService: MenuService) {
    this.usuarioId = this.rutaActiva.snapshot.params.id;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      usuario: ['', {
        validators: [Validators.required, Validators.pattern(CONST.REG_EXP_USUARIO)],
        asyncValidators: [this.usuarioUnicoService.validate.bind(this.usuarioUnicoService, this.usuarioId)],
        updateOn: 'blur'
      }],
      fechaInicioSesion: ['', [Validators.required]],
      fechaFinSesion: ['', [Validators.required]],
      codTipoUsuario: ['', [Validators.required]],
      codEstado: ['', [Validators.required]],
      inicioCierre: [false]
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
      this.formGroup.get('fechaInicioSesion').setValue(this.datePipe.transform(usuario.fechaInicioSesion, 'yyyy-MM-dd'));
      this.formGroup.get('fechaFinSesion').setValue(this.datePipe.transform(usuario.fechaFinSesion, 'yyyy-MM-dd'));
      this.formGroup.get('codTipoUsuario').setValue(usuario.codTipoUsuario);
      this.formGroup.get('codEstado').setValue(usuario.codEstado);
      this.formGroup.get('inicioCierre').setValue(usuario.inicioCierre);
    });
  }

  encuentraTodosArbol() {
    this.cargandoMenu = true;
    this.menuService.encuentraTodosArbolPorUsuario(this.usuarioId).subscribe(usuario => {
      this.cargandoMenu = false;
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

  regresar() {
    this.router.navigate(['/auth/mantenimiento/usuario']);
  }

  actualizarUsuario() {
    if (this.formGroup.valid) {
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
        valoresMenus: this.valoresMenus,
        guardarConMenu: !this.cargandoMenu
      };
      this.spinner.show();
      this.usuarioService.actualizar(usuarioActualizar).subscribe(
        respuesta => {
          this.spinner.hide();
          if (respuesta.exito) {
            this.toastr.success(respuesta.mensaje, '');
            this.regresar();
          } else {
            Swal.fire('', respuesta.mensaje || '', 'error');
          }
        }
      );
    }

  }
}
