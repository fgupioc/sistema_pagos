import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UsuarioService} from '../../../servicios/sistema/usuario.service';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {TreeviewComponent, TreeviewConfig, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {DefaultTreeviewI18n} from '../../../../lib/default-treeview-i18n';
import {ActivatedRoute, Router} from '@angular/router';
import {CONST} from '../../../comun/CONST';
import {UsuarioUnicoService} from '../../../validaciones/usuario-unico.directive';
import {Select2OptionData} from 'ng2-select2';
import {Rol} from '../../../interfaces/rol';
import {RolService} from '../../../servicios/rol.service';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
  providers: [
    {provide: TreeviewI18n, useClass: DefaultTreeviewI18n}
  ]
})
export class UsuarioEditarComponent implements OnInit {
  @ViewChild(TreeviewComponent, {static: false}) treeviewComponent: TreeviewComponent;
  public exampleData: Array<Select2OptionData> = [];
  public options: Select2Options;

  usuarioAEditar;
  menus = [];
  menusInicializacion = [];
  usuarioId = 0;
  public formGroup: FormGroup;
  roles: Rol[] = [];
  rolesElegidos: any[] = [];
  public valoresElegidos: string[] = [];
  estados = [];
  datePipe = new DatePipe('es-PE');
  cargandoMenu = false;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
              private usuarioUnicoService: UsuarioUnicoService,
              private toastr: ToastrService, private router: Router, private rutaActiva: ActivatedRoute,
              private rolService: RolService,
              private usuarioService: UsuarioService, private maestroService: MaestroService,
              private menuService: MenuService) {
    const state = this.router.getCurrentNavigation().extras.state;
    if (state === undefined || state.usuarioId === undefined) {
      this.regresar();
    }
    this.usuarioId = state.usuarioId;
  }

  ngOnInit() {
    this.options = {
      multiple: true,
      placeholder: 'Selecciona un rol...',
      width: '100%'
    };
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
      rolId: [''],
      rolElegidoId: [''],
      codEstado: ['', [Validators.required]],
      inicioCierre: [false]
    });
    this.listarRolesActivos();
    this.listarTiposDeUsuarios();
    this.listarEstadosDeRegistro();
  }

  resturarAutorizacionesOriginales() {
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    if (rolId > 0) {
      const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
      if (rol) {
        rol.autorizacionesModificadas = JSON.parse(JSON.stringify(rol.autorizacionesOriginales));
      }
      this.encuentraTodosArbol();
    }
  }

  listarRolesActivos() {
    this.rolService.listarActivos().subscribe(res => {
      this.roles = res;
      const dataSelect2 = [];
      this.roles.forEach(rol => {
        dataSelect2.push({id: rol.id.toString(), text: rol.nombre});
      });
      this.exampleData = dataSelect2;
      this.obtenerUsuario();
    });
  }

  onSelectedChange(menuIds: any[]) {
    let unselectedMenuIds: string[] = [];

    if (this.treeviewComponent) {
      const uncheckedItems = this.treeviewComponent.selection.uncheckedItems;
      unselectedMenuIds = uncheckedItems.map(item => item.value);
    }

    this.menus.forEach(menu => menu.children.forEach(hijo => hijo.checked = false));

    menuIds.forEach(menuId => {
      this.menus.forEach(menu => {
        const objMenuHijo = menu.children.find(menuHijo => menuHijo.value == menuId);
        if (objMenuHijo) {
          objMenuHijo.checked = true;
        }
      });
    });

    // Cambiar a false las autorizaciones de los menus no elegidos
    unselectedMenuIds.forEach(menuId => {
      this.menus.forEach(menus2 => {
        const menuHijo = menus2.children.find(hijo => hijo.value == menuId);
        if (menuHijo) {
          menuHijo.autorizaciones.forEach(autori => autori.checked = false);
        }
      });
    });

    // Cambiar a false las autorizaciones de los menus no elegidos que se envian al servidor

    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);

    if (rol) {
      unselectedMenuIds.forEach(unselectedMenuId => {
        const autoModificadas = rol.autorizacionesModificadas.filter(autoModi => autoModi.menuId != unselectedMenuId);
        rol.autorizacionesModificadas = JSON.parse(JSON.stringify(autoModificadas));
      });
    }
  }

  onFilterChange(value: string) {
    console.log('filter:', value);
  }

  isSelectedAutorizacion(autorizacionId) {
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
    if (rol) {
      return rol.autorizacionesModificadas.findIndex(item => item.autorizacionId == autorizacionId) >= 0;
      // return rol.autorizacionesModificadas.indexOf(autorizacionId) >= 0;
      // rolMenuAutoris = rol.autorizacionesModificadas;
    }
    return false;
    // return this.autorizacionesElegidos.indexOf(autorizacionId) >= 0;
  }

  onChangeCheckAutorizacion(menu: any, autorizacionId: number) {
    console.log(menu, autorizacionId);
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
    if (rol) {
      const index = rol.autorizacionesModificadas.findIndex(auto => auto.autorizacionId == autorizacionId);

      const autoriDelMenu = menu.autorizaciones.find(auto => auto.id == autorizacionId);
      if (index == -1) {
        /*
        const autoriOri = rol.autorizacionesOriginales.find(auto => auto.autorizacionId == autorizacionId);
        if (autoriOri) {
          rol.autorizacionesModificadas.push(autoriOri);
        }
        */
        // rol.autorizacionesModificadas.push(autorizacionId);

        if (autoriDelMenu) {
          const newAuto = {rolId: Number(rolId), menuId: menu.value, autorizacionId};
          rol.autorizacionesModificadas.push(newAuto);
          autoriDelMenu.checked = true;
        }
      } else {
        if (autoriDelMenu) {
          autoriDelMenu.checked = false;
        }
        rol.autorizacionesModificadas.splice(index, 1);
      }
    }
    console.log('rol', rol);
  }

  obtenerUsuario() {
    setTimeout(() => this.spinner.show());
    this.usuarioService.obtenerUsuario(this.usuarioId).subscribe(respuesta => {
      if (respuesta.exito) {
        const usuario: any = respuesta.objeto;
        this.usuarioAEditar = usuario;
        this.spinner.hide();
        const rolesMarcados = [];
        const valoresTemp: string[] = [];

        this.rolesElegidos = [];
        console.log(usuario.roles);
        usuario.roles.forEach(rolUsu => {
          const rol = this.roles.find(rolObj => rolObj.id == rolUsu.id);
          console.log(rol);
          if (rol) {
            // Asignamos autorizaciones del usuario a los roles activos
            rol.autorizacionesOriginales = JSON.parse(JSON.stringify(rolUsu.usuarioRolMenuAutoris));
            rol.autorizacionesModificadas = rolUsu.usuarioRolMenuAutoris;
            rolesMarcados.push(rol.id);
            this.rolesElegidos.push(rol);
            valoresTemp.push(rol.id.toString());
          }
        });

        this.valoresElegidos = valoresTemp;
        if (usuario.roles.length > 0) {
          this.formGroup.get('rolElegidoId').setValue(usuario.roles[0].id);
          this.onChangeRolFiltradoId();
        }

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

        this.formGroup.get('rolId').setValue(rolesMarcados);

        this.formGroup.get('codEstado').setValue(usuario.codEstado);
        this.formGroup.get('inicioCierre').setValue(usuario.inicioCierre);
      } else {
        this.spinner.hide();
        Swal.fire('', respuesta.mensaje || '', 'error');
      }
    });
  }

  changed(data: { value: string[] }) {
    // Convert array string to array number
    const rolesElegidosIds: number[] = data.value.map(x => +x);

    this.rolesElegidos = [];
    rolesElegidosIds.forEach(rolElegidoId => {
      const rolElegido = this.roles.find(rolObj => rolObj.id == rolElegidoId);
      if (rolElegido) {
        // Buscar si el rol elegido esta en el listado de roles actuales del usuario
        const rolEnUsuario = this.usuarioAEditar.roles.find(rolEnusuario => rolEnusuario.id == rolElegido.id);
        if (rolEnUsuario) {
          // Asignamos autorizaciones del usuario a los roles activos
          rolElegido.autorizacionesOriginales = rolEnUsuario.usuarioRolMenuAutoris;
          rolElegido.autorizacionesModificadas = JSON.parse(JSON.stringify(rolEnUsuario.usuarioRolMenuAutoris));
        } else {
          rolElegido.autorizacionesOriginales = [];
          rolElegido.autorizacionesModificadas = [];
        }
        this.rolesElegidos.push(rolElegido);
      }
    });

    const rolElegidoId2 = this.formGroup.get('rolElegidoId').value || '';
    // vacio y haya roles elegidos
    // tine vaalor y si este esta en el listado de roles elegidos

    if ((!rolElegidoId2 || (this.rolesElegidos.findIndex(obj => obj.id == rolElegidoId2) < 0)) && this.rolesElegidos.length > 0) {
      console.log('valor inicial ' + rolElegidoId2 + ' valor final ' + this.rolesElegidos[0].id);
      this.formGroup.get('rolElegidoId').setValue(this.rolesElegidos[0].id);
      this.onChangeRolFiltradoId();
    }
    console.log('roles elegidos', this.rolesElegidos);
  }

  onChangeRolId() {
    /*
    const rolesMarcados: number[] = this.formGroup.get('rolId').value;
    console.log(rolesMarcados);
    this.rolesElegidos = [];

    rolesMarcados.forEach(item => {
      const rol = this.roles.find(rolMarcado => rolMarcado.id == item);
      if (rol) {
        this.rolesElegidos.push(rol);
      }
    });
    console.log(this.rolesElegidos);
    */
  }

  onChangeRolFiltradoId() {
    console.log(this.rolesElegidos);
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    if (rolId > 0) {
      const rol: Rol = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
      console.log(rol);
      if (rol && rol.autorizacionesOriginales.length == 0 && rol.autorizacionesModificadas.length == 0) {
        // Si no tiene autorizaciones del usuario, jalar las autorizaciones del rol
        this.cargandoMenu = true;
        this.rolService.autorizaciones(rolId).subscribe(res => {
          rol.autorizacionesOriginales = res;
          if (rol.autorizacionesModificadas.length == 0) {
            rol.autorizacionesModificadas = JSON.parse(JSON.stringify(res));
          }
          console.log(this.rolesElegidos);
          this.encuentraTodosArbol();
        });
        /*
        rol.autorizacionesOriginales = res;
        if (rol.autorizacionesModificadas == null) {
          rol.autorizacionesModificadas = JSON.parse(JSON.stringify(res));
        }
        console.log(this.rolesElegidos);
        */
      } else {
        this.encuentraTodosArbol();
      }

      // Si usuario.roles esta vacio, ir al servidor y jalar las autorizaciones del rol elegido
      /*
      if (this.usuarioAEditar.roles.length == 0) {
        this.cargandoMenu = true;
        this.rolService.autorizaciones(rolId).subscribe(res => {
          const rol: Rol = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
          if (rol) {
            rol.autorizacionesOriginales = res;
            if (rol.autorizacionesModificadas == null) {
              rol.autorizacionesModificadas = JSON.parse(JSON.stringify(res));
            }
            console.log(this.rolesElegidos);
          }
          this.encuentraTodosArbol();
        });
      } else {
        this.encuentraTodosArbol();
      }
      */
    }
  }

  encuentraTodosArbol() {
    this.cargandoMenu = true;
    console.log('menusInicializacion');
    console.log(this.menusInicializacion);
    if (this.menusInicializacion.length == 0) {
      this.menuService.encuentraTodosArbol().subscribe(menus => {
        console.log('menus');
        console.log(menus);
        this.menusInicializacion = JSON.parse(JSON.stringify(menus));
        this.menus = menus;
        this.marcarCheckboxArbol();
      });
    } else {
      this.menus = JSON.parse(JSON.stringify(this.menusInicializacion));
      this.marcarCheckboxArbol();
    }
  }

  marcarCheckboxArbol() {
    // alert('menus cargados');
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    console.log('rolId :' + rolId);
    // console.log(this.rolesElegidos);
    if (rolId > 0) {
      const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
      console.log(rol);
      const rolMenuAutoris = rol.autorizacionesModificadas;
      const menusTemp = [];
      for (const menu of this.menus) {
        const menuTemp = menu;
        const menusChildrenTemp = [];
        for (const menuChildren of menu.children) {
          // For check menus
          const indexRMA = rolMenuAutoris.findIndex(rolMenuAutori => rolMenuAutori.menuId == menuChildren.value);
          if (indexRMA >= 0) {
            menuChildren.checked = true;

            // for check autorize
            for (const autorize of menuChildren.autorizaciones) {
              for (const rolMenuAutori of rolMenuAutoris) {
                if (autorize.id == rolMenuAutori.autorizacionId) {
                  autorize.checked = true;
                }
              }
            }
            menusChildrenTemp.push(menuChildren);
          }
        }
        if (menusChildrenTemp.length > 0) {
          menuTemp.children = menusChildrenTemp;
          menusTemp.push(menuTemp);
        }
      }
      this.menus = JSON.parse(JSON.stringify(menusTemp));
      // this.menusInicializacion = JSON.parse(JSON.stringify(menusTemp));
      this.items = menusTemp.map(value => {
        return new TreeviewItem(value);
      });
    }
    this.cargandoMenu = false;
  }

  listarTiposDeUsuarios() {
    // this.maestroService.listarTiposDeUsuarios().subscribe(res => this.tiposUsuarios = res);
  }

  listarEstadosDeRegistro() {
    this.maestroService.listarEstadosDeRegistro().subscribe(res => this.estados = res);
  }

  regresar() {
    this.router.navigate(['/auth/seguridad/usuario']);
  }

  validarMenusConAlMenosUnRol(): string {
    let mensajeError = '';
    for (const menu of this.menus) {
      for (const menuChildren of menu.children) {
        if (menuChildren.checked) {
          const item = menuChildren.autorizaciones.find(autori => autori.checked == true);
          if (!item) {
            mensajeError = `${menu.text} | ${menuChildren.text}, no se ha elegido ningúna autorización`;
            break;
          }
        }
      }
      if (mensajeError) {
        break;
      }
    }
    return mensajeError;
  }

  actualizarUsuario() {
    if (this.formGroup.valid) {
      const mensajeError = this.validarMenusConAlMenosUnRol();
      if (mensajeError) {
        Swal.fire('', mensajeError, 'error');
        return;
      }
      const usuario = {
        personaId: this.usuarioId,
        // tipoUsuario: this.formGroup.get('codTipoUsuario').value,
        email: this.formGroup.get('email').value,
        numeroCelular: this.formGroup.get('numeroCelular').value,
        fechaInicioSesion: this.formGroup.get('fechaInicioSesion').value,
        fechaFinSesion: this.formGroup.get('fechaFinSesion').value,
        inicioCierre: this.formGroup.get('inicioCierre').value,
        codEstado: this.formGroup.get('codEstado').value,
      };
      const usuarioActualizar = {
        usuario,
        roles: this.rolesElegidos
        // guardarConMenu: !this.cargandoMenu
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

  desactivarActualizar() {
    return this.formGroup.invalid || this.formGroup.pending || this.cargandoMenu;
  }
}
