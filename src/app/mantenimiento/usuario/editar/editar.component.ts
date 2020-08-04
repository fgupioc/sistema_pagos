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
  tiposUsuarios = [];
  listaSexo = [];
  listaDoi = [];
  usuarioId = 0;
  public formGroup: FormGroup;
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

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
              private usuarioUnicoService: UsuarioUnicoService,
              private toastr: ToastrService, private router: Router,
              private usuarioService: UsuarioService, private maestroService: MaestroService,
              private menuService: MenuService) {
    const state = this.router.getCurrentNavigation().extras.state;
    if (state === undefined || state.usuarioId === undefined) {
      this.regresar();
    }
    this.usuarioId = state.usuarioId;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      tipoDocIdentidad: [{value: '', disabled: true}, false],
      numDocIdentidad: [{value: '', disabled: true}, false],
      primerNombre: [{value: '', disabled: true}, false],
      segundoNombre: [{value: '', disabled: true}, false],
      primerApellido: [{value: '', disabled: true}, false],
      segundoApellido: [{value: '', disabled: true}, false],
      estadoCivil: [{value: '', disabled: true}, false],
      sexo: [{value: '', disabled: true}, false],
      fechaNacimiento: [{value: '', disabled: true}, false],

      numeroCelular: ['', [Validators.required, Validators.pattern('^\\d+$'), Validators.maxLength(9)]],
      email: ['', {
        validators: [Validators.required, Validators.email],
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

      this.formGroup.get('tipoDocIdentidad').setValue(usuario.desTipoDocIdentificacion);
      this.formGroup.get('numDocIdentidad').setValue(usuario.numeroDocumentoIdentificacion);
      this.formGroup.get('primerNombre').setValue(usuario.primerNombre);
      this.formGroup.get('segundoNombre').setValue(usuario.segundoNombre);
      this.formGroup.get('primerApellido').setValue(usuario.primerApellido);
      this.formGroup.get('segundoApellido').setValue(usuario.segundoApellido);
      this.formGroup.get('estadoCivil').setValue(usuario.desEstadoCivil);
      this.formGroup.get('sexo').setValue(usuario.desSexo);
      this.formGroup.get('fechaNacimiento').setValue(this.datePipe.transform(usuario.fechaNacimiento, 'dd/MM/yyyy'));

      this.formGroup.get('numeroCelular').setValue(usuario.numeroCelular);
      this.formGroup.get('email').setValue(usuario.email);
      this.formGroup.get('fechaInicioSesion').setValue(this.datePipe.transform(usuario.fechaInicioSesion, 'yyyy-MM-dd'));
      this.formGroup.get('fechaFinSesion').setValue(this.datePipe.transform(usuario.fechaFinSesion, 'yyyy-MM-dd'));
      this.formGroup.get('codTipoUsuario').setValue(usuario.codTipoUsuario);
      this.formGroup.get('codEstado').setValue(usuario.codEstado);
      this.formGroup.get('inicioCierre').setValue(usuario.inicioCierre);
    });
  }

  encuentraTodosArbol() {
    this.cargandoMenu = true;
    this.menuService.encuentraTodosArbolPorUsuario().subscribe(usuario => {
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
        codTipoUsuario: this.formGroup.get('codTipoUsuario').value,
        email: this.formGroup.get('email').value,
        numeroCelular: this.formGroup.get('numeroCelular').value,
        fechaInicioSesion: this.formGroup.get('fechaInicioSesion').value,
        fechaFinSesion: this.formGroup.get('fechaFinSesion').value,
        inicioCierre: this.formGroup.get('inicioCierre').value,
        codEstado: this.formGroup.get('codEstado').value,
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
