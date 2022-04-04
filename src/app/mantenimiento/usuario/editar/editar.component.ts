import {PersonaService} from './../../../servicios/persona.service';
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
import {Select2OptionData} from 'ng2-select2';
import {Rol} from '../../../interfaces/rol';
import {RolService} from '../../../servicios/rol.service';
import {UsuarioUnicoService} from '../../../validaciones/usuario-unico.service';

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
  errorPersonaConUsuario: any;
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
  personaId = 0;
  loading = true;
  tipoEstadosCivil = [];
  listaDoi = [];
  maximoValor = 8;
  messageDocIdInvalid = '';
  messagePattern: string;
  listaSexo = [];
  menuInit: any[] = [];

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
              private usuarioUnicoService: UsuarioUnicoService,
              private toastr: ToastrService, private router: Router, private rutaActiva: ActivatedRoute,
              private rolService: RolService,
              private usuarioService: UsuarioService, private maestroService: MaestroService,
              private menuService: MenuService, private personaService: PersonaService) {
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
    this.listarTipoSexos();
    this.listarTipoDocumentos();
    this.listarTipoEstadosCivil();
    this.listarRolesActivos();
    this.listarTiposDeUsuarios();
    this.listarEstadosDeRegistro();

    this.formGroup = this.formBuilder.group({
      tipoDocIdentidad: ['', false],
      numDocIdentidad: ['', false],
      primerNombre: ['', false],
      segundoNombre: ['', false],
      primerApellido: ['', false],
      segundoApellido: ['', false],
      estadoCivil: ['', false],
      sexo: ['', false],
      fechaNacimiento: ['', false],

      numeroCelular: ['', [Validators.required, Validators.pattern('^\\d+$'), Validators.maxLength(9)]],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.usuarioUnicoService.validate.bind(this.usuarioUnicoService, this.usuarioId)],
        updateOn: 'blur'
      }],
      fechaInicio: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
      rolId: [''],
      rolElegidoId: [''],
      codEstado: ['', [Validators.required]],
      inicioCierre: [false]
    });

  }

  listarTipoSexos() {
    this.maestroService.listarTipoSexos().subscribe(
      result => {
        this.listaSexo = result;
      }
    );
  }


  listarTipoEstadosCivil() {
    this.maestroService.listarTipoEstadosCivil().subscribe(response => this.tipoEstadosCivil = response);
  }

  listarTipoDocumentos() {
    this.maestroService.listarTipoDocumentos().subscribe(
      result => {
        this.listaDoi = result;
      }
    );
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
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
    if (rol) {
      const index = rol.autorizacionesModificadas.findIndex(auto => auto.autorizacionId == autorizacionId);

      const autoriDelMenu = menu.autorizaciones.find(auto => auto.id == autorizacionId);
      if (index == -1) {
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
        usuario.roles.forEach(rolUsu => {
          const rol = this.roles.find(rolObj => rolObj.id == rolUsu.id);

          if (rol) {
            this.rolesElegidos.push({
              autorizacionesOriginales: rolUsu.rolMenuAutoris,
              autorizacionesModificadas: rolUsu.usuarioRolMenuAutoris,
              id: rol.id
            });

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
        this.formGroup.get('fechaNacimiento').setValue(this.datePipe.transform(usuario.fechaNacimiento, 'yyyy-MM-dd'));

        this.formGroup.get('numeroCelular').setValue(usuario.numeroCelular);
        this.formGroup.get('email').setValue(usuario.email);
        this.formGroup.get('fechaInicio').setValue(this.datePipe.transform(usuario.fechaInicioSesion, 'yyyy-MM-dd'));
        this.formGroup.get('fechaFinal').setValue(this.datePipe.transform(usuario.fechaFinSesion, 'yyyy-MM-dd'));

        this.formGroup.get('rolId').setValue(rolesMarcados);

        this.formGroup.get('codEstado').setValue(usuario.codEstado);
        this.formGroup.get('inicioCierre').setValue(usuario.inicioCierre);
      } else {
        this.spinner.hide();
        Swal.fire('', respuesta.mensaje || '', 'error');
      }
    });
  }

  changed(data: any) {
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
          rolElegido.autorizacionesOriginales = rolEnUsuario.rolMenuAutoris;
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
      this.formGroup.get('rolElegidoId').setValue(this.rolesElegidos[0].id);
      this.onChangeRolFiltradoId();
    }
  }

  onChangeRolId() {

  }

  onChangeTypeDocument() {
    const typoDoc: string = this.formGroup.get('tipoDocIdentidad').value;

    this.formGroup.patchValue({numDocIdentidad: ''});
    this.getValidateDocumentIdentity(typoDoc, '');
  }

  getValidateDocumentIdentity(typeDocId: string, numberDocId: string): boolean {
    let value = true;
    this.maximoValor = 8;
    if (typeDocId) {
      switch (typeDocId) {
        case '1': // DNI
          this.maximoValor = 8;
          this.messageDocIdInvalid = 'El número de documento debe tener 8 dígitos';
          this.messagePattern = 'El número de documento solo acepta números.';
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.pattern(CONST.C_STR_EXP_REGULAR_NUMERO),
              Validators.minLength(8),
            ]),
          );
          break;
        case '4': // CARNET DE EXTRANJERIA
          this.maximoValor = 12;
          this.messageDocIdInvalid = 'El número de documento debe tener hasta 12 caracteres';
          this.messagePattern = 'El número de documento solo acepta números y letras.';
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.minLength(2),
              Validators.pattern(CONST.C_STR_EXP_REGULAR_NUMERO_LETRAS)
            ]),
          );
          break;
        case '6': // RUC
          this.maximoValor = 11;
          this.messageDocIdInvalid = 'El número de documento debe tener 11 dígitos';
          this.messagePattern = 'El número de documento solo acepta números.';
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.minLength(11),
              Validators.pattern(CONST.C_STR_EXP_REGULAR_NUMERO),
            ]),
          );
          break;
        case '7': //  PASAPORTE
          this.maximoValor = 12;
          this.messageDocIdInvalid = 'El número de documento debe tener hasta 12 caracteres';
          this.messagePattern = 'El número de documento solo acepta números y letras.';
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.minLength(2),
              Validators.pattern(CONST.C_STR_EXP_REGULAR_NUMERO_LETRAS)
            ]),
          );
          break;
        case '11': //  PARTIDA DE NACIMIENTO
          this.maximoValor = 15;
          this.messageDocIdInvalid = 'El número de documento debe tener hasta 15 caracteres';
          this.messagePattern = 'El número de documento solo acepta números y letras.';
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.minLength(2),
              Validators.pattern(CONST.C_STR_EXP_REGULAR_NUMERO_LETRAS)
            ]),
          );
          break;
      }
    } else {
      value = false;
    }

    return value;
  }

  onChangeRolFiltradoId() {
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    if (rolId > 0) {
      const rol: Rol = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
      if (rol && rol.autorizacionesOriginales.length == 0 && rol.autorizacionesModificadas.length == 0) {
        // Si no tiene autorizaciones del usuario, jalar las autorizaciones del rol
        this.cargandoMenu = true;
        this.rolService.autorizaciones(rolId).subscribe(res => {
          rol.autorizacionesOriginales = res;
          res.forEach(i => {
            const item = this.menuInit.find(x => x == i.menuId);
            if (!item) {
              this.menuInit.push(i.menuId);
            }
          });

          if (rol.autorizacionesModificadas.length == 0) {
            rol.autorizacionesModificadas = JSON.parse(JSON.stringify(res));
          }
          this.encuentraTodosArbolPorId(rolId);
        });
      } else {
        this.encuentraTodosArbolPorId(rolId);
      }
    }
  }


  encuentraTodosArbolPorId(rolId: any) {
    setTimeout(() => this.spinner.show(), 10);
    this.menuService.encuentraTodosArbolPorId(rolId).subscribe(menus => {
      this.menus = menus;
      this.marcarCheckboxArbol();
      this.loading = false;
      this.spinner.hide();
    }, err => this.spinner.hide());
  }

  crearMenusOriginales(menus: any[], ids: any[]): any[] {
    const menss = [];

    menus.forEach(m => {
      const subMenu = [];
      m.children.forEach(sm => {
        if (ids.includes(sm.value)) {
          subMenu.push(sm);
        }
      });
      if (subMenu.length > 0) {
        menss.push({
          autorizaciones: m.autorizaciones,
          checked: m.checked,
          children: subMenu,
          codEstado: m.codEstado,
          collapsed: m.collapsed,
          disabled: m.disabled,
          jerarquia: m.jerarquia,
          text: m.text,
          ultimo: m.ultimo,
          value: m.value
        });
      }
    });
    return menss;
  }

  marcarCheckboxArbol() {
    // alert('menus cargados');
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    if (rolId > 0) {
      const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
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
          } else {
            menusChildrenTemp.push(menuChildren);
          }
        }
        if (menusChildrenTemp.length > 0) {
          menuTemp.children = menusChildrenTemp;
          menusTemp.push(menuTemp);
        }
      }
      this.menus = JSON.parse(JSON.stringify(menusTemp));
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
        codUsuario: this.usuarioId,
        // tipoUsuario: this.formGroup.get('codTipoUsuario').value,
        // tipoUsuario: this.formGroup.get('codTipoUsuario').value,
        email: this.formGroup.get('email').value,
        numeroCelular: this.formGroup.get('numeroCelular').value,
        fechaInicio: this.formGroup.get('fechaInicio').value,
        fechaFinal: this.formGroup.get('fechaFinal').value,
        inicioCierre: this.formGroup.get('inicioCierre').value,
        codEstado: this.formGroup.get('codEstado').value,
      };

      const persona = {
        id: this.usuarioId,
        alias: '',
        fechaNacimiento: this.formGroup.get('fechaNacimiento').value
      };

      const personaNatural = {
        codPersona: this.usuarioId,
        primerApellido: this.formGroup.get('primerApellido').value,
        segundoApellido: this.formGroup.get('segundoApellido').value,
        primerNombre: this.formGroup.get('primerNombre').value,
        segundoNombre: this.formGroup.get('segundoNombre').value,
        sexo: this.formGroup.get('sexo').value,
        estadoCivil: this.formGroup.get('estadoCivil').value,
      };

      const personaIdentificacion = {
        tipoDocumento: this.formGroup.get('tipoDocIdentidad').value,
        numeroDocumento: this.formGroup.get('numDocIdentidad').value,
      };

      const usuarioActualizar = {
        usuario,
        roles: this.rolesElegidos,
        personaNatural,
        persona,
        personaIdentificacion
      };

      const sinAuths = [];
      this.rolesElegidos.forEach(m => {
        if (m.autorizacionesOriginales.length == 0) {
          sinAuths.push(m.nombre);
        }
      });

      if (sinAuths.length > 0) {
        Swal.fire('', 'Debe seleccionar los accesos y autorizaciones para [' + sinAuths.toString() + ']', 'warning');
        return;
      }

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

  buscarPersonaPorDocId() {
    const tipDoi: string = this.formGroup.get('tipoDocIdentidad').value;
    const numDoi: string = this.formGroup.get('numDocIdentidad').value;

    this.personaId = 0;

    if (this.formGroup.get('tipoDocIdentidad').valid && this.formGroup.get('numDocIdentidad').valid) {
      this.personaService.buscarPersonaPorDocId(tipDoi, numDoi).subscribe(
        result => {
          if (result != null) {
            if (result.codigo == CONST.C_STR_CODIGO_ERROR) {
              this.errorPersonaConUsuario = result.mensaje;
              this.formGroup.get('numDocIdentidad').setErrors({personaConUsuario: true}); // Error temporal
            } else {
              if (result.objeto != null) {
                const objeto = result.objeto;
                this.personaId = objeto.personaId;
                this.formGroup.get('primerNombre').disable();
                this.formGroup.get('primerNombre').setValue(objeto.primerNombre);
                this.formGroup.get('segundoNombre').disable();
                this.formGroup.get('segundoNombre').setValue(objeto.segundoNombre);
                this.formGroup.get('primerApellido').disable();
                this.formGroup.get('primerApellido').setValue(objeto.primerApellido);
                this.formGroup.get('segundoApellido').disable();
                this.formGroup.get('segundoApellido').setValue(objeto.segundoApellido);
                this.formGroup.get('sexo').disable();
                this.formGroup.get('sexo').setValue(objeto.codSexo);
                this.formGroup.get('estadoCivil').disable();
                this.formGroup.get('estadoCivil').setValue(objeto.estadoCivil);
                this.formGroup.get('fechaNacimiento').disable();
                this.formGroup.get('fechaNacimiento').setValue(this.datePipe.transform(objeto.fechaNacimiento, 'yyyy-MM-dd'));
                if (objeto.correo != null) {
                  this.formGroup.get('email').setValue(objeto.correo);
                  this.formGroup.get('email').disable();
                }
                if (objeto.telefonoMovil != null) {
                  this.formGroup.get('numeroCelular').setValue(objeto.telefonoMovil);
                  this.formGroup.get('numeroCelular').disable();
                }
              }
            }
          } else {
            this.formGroup.get('primerNombre').enable();
            this.formGroup.get('segundoNombre').enable();
            this.formGroup.get('primerApellido').enable();
            this.formGroup.get('segundoApellido').enable();
            this.formGroup.get('sexo').enable();
            this.formGroup.get('estadoCivil').enable();
            this.formGroup.get('fechaNacimiento').enable();
            this.formGroup.get('email').enable();
            this.formGroup.get('numeroCelular').enable();

            this.formGroup.get('primerNombre').setValue('');
            this.formGroup.get('segundoNombre').setValue('');
            this.formGroup.get('primerApellido').setValue('');
            this.formGroup.get('segundoApellido').setValue('');
            this.formGroup.get('sexo').setValue('');
            this.formGroup.get('estadoCivil').setValue('');
            this.formGroup.get('fechaNacimiento').setValue('');
            this.formGroup.get('email').setValue('');
            this.formGroup.get('numeroCelular').setValue('');
          }
        }
      );
    } else {
      this.formGroup.get('primerNombre').setValue('');
      this.formGroup.get('segundoNombre').setValue('');
      this.formGroup.get('primerApellido').setValue('');
      this.formGroup.get('segundoApellido').setValue('');
      this.formGroup.get('sexo').setValue('');
      this.formGroup.get('estadoCivil').setValue('');
      this.formGroup.get('fechaNacimiento').setValue('');
    }
  }
}
