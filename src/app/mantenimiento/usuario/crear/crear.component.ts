import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuarioService} from '../../../servicios/sistema/usuario.service';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {DatePipe} from '@angular/common';
import Swal from 'sweetalert2';
import {CONST} from '../../../comun/CONST';
import {UsuarioUnicoService} from '../../../validaciones/usuario-unico.directive';

@Component({
  selector: 'app-usuario-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class UsuarioCrearComponent implements OnInit {
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
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      usuario: ['', {
        validators: [Validators.required, Validators.pattern(CONST.REG_EXP_USUARIO)],
        asyncValidators: [this.usuarioUnicoService.validate.bind(this.usuarioUnicoService, 0)]
      }],
      fechaInicioSesion: ['', [Validators.required]],
      fechaFinSesion: ['', [Validators.required]],
      codTipoUsuario: ['', [Validators.required]],
      codEstado: ['', [Validators.required]],
      inicioCierre: [false],
    });
    this.formGroup.get('fechaInicioSesion').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.listarTiposDeUsuarios();
    this.listarEstadosDeRegistro();
    this.encuentraTodosArbol();
  }

  encuentraTodosArbol() {
    this.cargandoMenu = true;
    this.menuService.encuentraTodosArbol().subscribe(usuario => {
      this.cargandoMenu = false;
      this.items = usuario.map(value => {
        return new TreeviewItem(value);
      });
    });
  }

  onFilterChange(value: string) {
    console.log('filter:', value);
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

  crearUsuario() {
    if (this.formGroup.valid) {
      const usuario = {
        usuario: this.formGroup.get('usuario').value,
        fechaInicioSesion: this.formGroup.get('fechaInicioSesion').value,
        fechaFinSesion: this.formGroup.get('fechaFinSesion').value,
        codTipoUsuario: this.formGroup.get('codTipoUsuario').value,
        codEstado: this.formGroup.get('codEstado').value,
        inicioCierre: this.formGroup.get('inicioCierre').value,
      };
      const usuarioNuevo = {
        usuario,
        valoresMenus: this.valoresMenus,
        guardarConMenu: !this.cargandoMenu
      };
      this.spinner.show();
      this.usuarioService.guardar(usuarioNuevo).subscribe(
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
