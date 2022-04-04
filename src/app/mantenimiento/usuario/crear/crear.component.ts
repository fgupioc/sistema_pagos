import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TreeviewComponent, TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuarioService} from '../../../servicios/sistema/usuario.service';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {MenuService} from '../../../servicios/sistema/menu.service';
import {DatePipe} from '@angular/common';
import Swal from 'sweetalert2';
import {CONST} from '../../../comun/CONST';
import {PersonaService} from '../../../servicios/persona.service';
import {Select2OptionData} from 'ng2-select2';
import {Rol} from '../../../interfaces/rol';
import {RolService} from '../../../servicios/rol.service';
import {UsuarioUnicoService} from '../../../validaciones/usuario-unico.directive';

@Component({
  selector: 'app-usuario-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class UsuarioCrearComponent implements OnInit {
  @ViewChild(TreeviewComponent, {static: false}) treeviewComponent: TreeviewComponent;
  public exampleData: Array<Select2OptionData> = [];
  public options: Select2Options;
  public formGroup: FormGroup;
  roles: Rol[] = [];
  rolesElegidos: any[] = [];

  // autorizaciones: any[] = [];

  menus = [];
  menusInicializacion = [];
  listaSexo = [];
  listaDoi = [];
  estados = [];
  tipoEstadosCivil = [];
  // autorizacionesElegidos = [];
  datePipe = new DatePipe('es-PE');
  maximoValor = 8;
  personaId = 0;
  cargandoMenu = false;
  errorPersonaConUsuario = '';
  items: TreeviewItem[];
  valoresMenus: number[] = [];
  messageDocIdInvalid = '';
  messagePattern: string;
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private menuService: MenuService,
              private usuarioUnicoService: UsuarioUnicoService, private toastr: ToastrService, private router: Router,
              private rutaActiva: ActivatedRoute, private personaService: PersonaService, private rolService: RolService,
              private usuarioService: UsuarioService, private maestroService: MaestroService) {
  }

  ngOnInit() {
    this.options = {
      multiple: true,
      placeholder: 'Selecciona un rol...',
      width: '100%'
    };

    this.formGroup = this.formBuilder.group({
      tipoDocIdentidad: ['', [Validators.required]],
      numDocIdentidad: ['', [Validators.required, Validators.minLength(this.maximoValor), Validators.pattern('^\\d+$')]],
      primerNombre: ['', [Validators.required,]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required,]],
      segundoApellido: [''],
      numeroCelular: ['', [Validators.required, Validators.pattern('^\\d+$'), Validators.maxLength(9)]],
      estadoCivil: [''],
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.usuarioUnicoService.validate.bind(this.usuarioUnicoService, 0)],
        updateOn: 'blur'
      }],
      fechaInicio: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
      rolId: [''],
      rolElegidoId: ['', [Validators.required]],
      codEstado: ['', [Validators.required]],
      inicioCierre: [false],
      contrasenha: ['', [Validators.required, Validators.minLength(this.contrasenhaLongitudMinima()),
        Validators.pattern(CONST.REG_EXP_CONTRASENHA)]],
      confirmarContrasenha: ['', [Validators.required]],
    });
    this.formGroup.get('fechaInicio').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.listarRolesActivos();
    this.listarEstadosDeRegistro();
    this.listarTipoDocumentos();
    this.listarTipoSexos();
    this.listarTipoEstadosCivil();
  }

  changed(data: { value: string[] }) {
    // Convert array string to array number
    const rolesMarcados: number[] = data.value.map(x => +x);

    this.rolesElegidos = [];

    rolesMarcados.forEach(item => {
      const rol = this.roles.find(rolMarcado => rolMarcado.id == item);
      if (rol) {
        this.rolesElegidos.push(rol);
      }
    });
    const rolElegidoId = this.formGroup.get('rolElegidoId').value || '';
    if (!rolElegidoId && this.rolesElegidos.length > 0) {
      this.formGroup.get('rolElegidoId').setValue(this.rolesElegidos[0].id);
      this.onChangeRolFiltradoId();
    }
    console.log('roles elegidos', this.rolesElegidos);
  }

  /*
  obtenerRol() {
    setTimeout(() => this.spinner.show());
    this.rolService.obtenerRol(this.rolId).subscribe(rol => {
      this.spinner.hide();
      this.formGroup.get('nombre').setValue(rol.nombre);
      this.formGroup.get('codEstado').setValue(rol.codEstado);
      this.rol = rol;
    });
    this.encuentraTodosArbol();
  }
  */

  listarTipoEstadosCivil() {
    this.maestroService.listarTipoEstadosCivil().subscribe(response => this.tipoEstadosCivil = response);
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
        /*
      case '00': // OTROS NUMEROS
        this.maximoValor = 15;
        this.messageDocIdInvalid = 'El número de documento debe tener hasta 15 caracteres';
        this.formGroup.get('numDocIdentidad').setValidators(
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
          ]),
        );
        break;
      case 'A': // Cedula diplomatica de indetidad
        this.maximoValor = 15;
        this.messageDocIdInvalid = 'El número de documento debe tener hasta 15 caracteres';
        this.formGroup.get('numDocIdentidad').setValidators(
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
          ]),
        );
        break;
         */
      }
    } else {
      value = false;
    }

    return value;
  }

  verificarContrasenhasIguales() {
    if (this.formGroup.get('contrasenha').value !== this.formGroup.get('confirmarContrasenha').value) {
      this.formGroup.get('confirmarContrasenha').setErrors({diferente: true}); // Error temporal
    } else {
      this.formGroup.get('confirmarContrasenha').updateValueAndValidity();
    }
  }

  contrasenhaLongitudMinima() {
    return CONST.N_CONTRASENHA_LONGITUD_MINIMA;
  }

  listarTipoDocumentos() {
    this.maestroService.listarTipoDocumentos().subscribe(
      result => {
        this.listaDoi = result;
      }
    );
  }

  listarTipoSexos() {
    this.maestroService.listarTipoSexos().subscribe(
      result => {
        this.listaSexo = result;
      }
    );
  }

  encuentraTodosArbol() {
    this.cargandoMenu = true;
    if (this.menusInicializacion.length == 0) {
      setTimeout(() => this.spinner.show(), 10);
      this.menuService.encuentraTodosArbol().subscribe(menus => {
        this.menusInicializacion = JSON.parse(JSON.stringify(menus));
        this.menus = menus;
        this.marcarCheckboxArbol();
        this.spinner.hide();
      }, err => this.spinner.hide());
    } else {
      this.menus = JSON.parse(JSON.stringify(this.menusInicializacion));
      this.marcarCheckboxArbol();
    }
  }

  marcarCheckboxArbol() {
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
    let rolMenuAutoris = [];
    if (rol) {
      rolMenuAutoris = rol.autorizacionesModificadas;
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
      this.menusInicializacion = JSON.parse(JSON.stringify(menusTemp));
      this.items = menusTemp.map(value => {
        return new TreeviewItem(value);
      });
    }
    this.cargandoMenu = false;
  }

  onFilterChange(value: string) {
    console.log('filter:', value);
  }

  onChangeRolId() {
    /*
    const rolesMarcados: number[] = this.formGroup.get('rolId').value;
    this.rolesElegidos = [];

    rolesMarcados.forEach(item => {
      const rol = this.roles.find(rolMarcado => rolMarcado.id == item);
      if (rol) {
        this.rolesElegidos.push(rol);
      }
    });
    console.log('roles elegidos', this.rolesElegidos);
    console.log(this.formGroup.get('rolElegidoId').value);
    */
  }

  onChangeRolFiltradoId() {
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    if (rolId > 0) {
      this.spinner.show();
      this.cargandoMenu = true;
      this.rolService.autorizaciones(rolId).subscribe(
        res => {
          const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
          if (rol) {
            rol.autorizacionesOriginales = res;
            if (rol.autorizacionesModificadas == null) {
              rol.autorizacionesModificadas = JSON.parse(JSON.stringify(res));
            }
            console.log(this.rolesElegidos);
          }
          this.encuentraTodosArbol();
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
        }
      );
    }
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

  onSelectedChange(menuIds: any[]) {
    this.valoresMenus = menuIds;

    let unselectedMenuIds: string[] = [];

    if (this.treeviewComponent) {
      const uncheckedItems = this.treeviewComponent.selection.uncheckedItems;
      unselectedMenuIds = uncheckedItems.map(item => item.value);
    }

    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);

    this.menus.forEach(menu => menu.children.forEach(hijo => hijo.checked = false));

    this.valoresMenus.forEach(menuId => {
      this.menus.forEach(menus2 => {
        const item = menus2.children.find(hijo => hijo.value == menuId);
        if (item) {
          item.checked = true;
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
    if (rol) {
      unselectedMenuIds.forEach(unselectedMenuId => {
        const autoModificadas = rol.autorizacionesModificadas.filter(autoModi => autoModi.menuId != unselectedMenuId);
        rol.autorizacionesModificadas = JSON.parse(JSON.stringify(autoModificadas));
      });
    }
  }

  isSelectedAutorizacion(autorizacionId) {
    const rolId: number = this.formGroup.get('rolElegidoId').value || 0;
    const rol: any = this.rolesElegidos.find(rolObj => rolObj.id == rolId);
    if (rol && rol.autorizacionesModificadas && rol.autorizacionesModificadas.length > 0) {
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

  listarRolesActivos() {
    this.rolService.listarActivos().subscribe(res => {
      this.roles = res;
      const dataSelect2 = [];
      this.roles.forEach(rol => {
        dataSelect2.push({id: rol.id.toString(), text: rol.nombre});
      });
      this.exampleData = dataSelect2;
    });
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
          console.log(item);
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

  crearUsuario() {
    if (this.formGroup.valid) {
      const mensajeError = this.validarMenusConAlMenosUnRol();
      if (mensajeError) {
        Swal.fire('', mensajeError, 'error');
        return;
      }

      const persona = {
        codPersona: this.personaId, fechaNacimiento: this.formGroup.get('fechaNacimiento').value
      };
      const personaNatural = {
        primerNombre: this.formGroup.get('primerNombre').value,
        segundoNombre: this.formGroup.get('segundoNombre').value,
        primerApellido: this.formGroup.get('primerApellido').value,
        segundoApellido: this.formGroup.get('segundoApellido').value,
        sexo: this.formGroup.get('sexo').value,
        estadoCivil: this.formGroup.get('estadoCivil').value
      };
      const personaIdentificacion = {
        tipoDocumento: this.formGroup.get('tipoDocIdentidad').value,
        numeroDocumento: this.formGroup.get('numDocIdentidad').value,
      };
      const usuario = {
        // rolId: this.formGroup.get('rolId').value,
        email: this.formGroup.get('email').value,
        contrasenia: this.formGroup.get('contrasenha').value,
        numeroCelular: this.formGroup.get('numeroCelular').value,
        fechaInicio: this.formGroup.get('fechaInicio').value,
        fechaFinal: this.formGroup.get('fechaFinal').value,
        inicioCierre: this.formGroup.get('inicioCierre').value,
        codEstado: this.formGroup.get('codEstado').value,
      };
      const usuarioNuevo = {
        persona,
        personaNatural,
        personaIdentificacion,
        usuario,
        roles: this.rolesElegidos
        // guardarConMenu: !this.cargandoMenu
      };
      this.spinner.show();
      this.usuarioService.guardar(usuarioNuevo).subscribe(respuesta => {
        this.spinner.hide();
        if (respuesta.exito) {
          this.toastr.success(respuesta.mensaje, '');
          this.regresar();
        } else {
          Swal.fire('', respuesta.mensaje || '', 'error');
        }
      });
    }
  }

  buscarPersonaPorDocId() {
    const tipDoi: string = this.formGroup.get('tipoDocIdentidad').value;
    const numDoi: string = this.formGroup.get('numDocIdentidad').value;

    console.log(tipDoi, numDoi);

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
