import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Usuario} from '../../interfaces/Usuario';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {RolService} from '../../servicios/rol.service';
import {MaestroService} from '../../servicios/sistema/maestro.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {MenuService} from '../../servicios/sistema/menu.service';
import {UsuarioService} from '../../servicios/sistema/usuario.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CONST} from '../../comun/CONST';
import {RolBuscarUsuarioComponent} from '../rol-buscar-usuario/rol-buscar-usuario.component';
import {Rol} from '../../interfaces/rol';
import {TablaMaestra} from '../../interfaces/tabla-maestra';
import {RolUnicoService} from '../../validaciones/rol-unico.directive';

@Component({
  selector: 'app-rol-editar',
  templateUrl: './rol-editar.component.html',
  styles: []
})
export class RolEditarComponent implements OnInit {
  public formGroup: FormGroup;
  menus = [];
  usuarios: Usuario[] = [];
  rolId = 0;
  rol: any = {
    usuarioCreaDes: '',
    usuarioActualizaDes: '',
    fechaCreacion: '',
    fechaActualizacion: '',
  };
  estados = [];
  cargandoMenu = false;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  valoresMenus: string[] = [];

  autorizacionesElegidos = [];
  areas: TablaMaestra[] = [];

  constructor(private formBuilder: FormBuilder,
              private rolService: RolService,
              private maestroService: MaestroService,
              private rolUnicoService: RolUnicoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private menuService: MenuService,
              private usuarioService: UsuarioService,
              private ngbModal: NgbModal,
              private router: Router) {
    const state = this.router.getCurrentNavigation().extras.state;
    if (state === undefined || state.rolId === undefined) {
      this.regresar();
    }
    this.rolId = state.rolId;
  }

  ngOnInit() {
    this.loadAreas();
    this.formGroup = this.formBuilder.group({
      nombre: ['', {
        validators: [Validators.required],
        asyncValidators: [this.rolUnicoService.validate.bind(this.rolUnicoService, this.rolId)],
        updateOn: 'blur'
      }],
      codEstado: [CONST.S_ESTADO_REG_ACTIVO, [Validators.required]],
      codArea: ['', Validators.required]
    });
    this.listarEstadosDeRegistro();
    this.obtenerRol();
  }

  isSelectedAutorizacion(topic) {
    return this.autorizacionesElegidos.indexOf(topic) >= 0;
  }

  changeAutorizacion($event: Event) {
    //&&//console.log();
  }

  onChangeCheckAutorizacion(menu: any, autorizacionId: number) {
    const index = this.autorizacionesElegidos.indexOf(autorizacionId);
    const autori = menu.autorizaciones.find(auto => auto.id == autorizacionId);
    if (index == -1) {
      this.autorizacionesElegidos.push(autorizacionId);
      if (autori) {
        autori.checked = true;
      }
    } else {
      if (autori) {
        autori.checked = false;
      }
      this.autorizacionesElegidos.splice(index, 1);
    }
  }

  obtenerRol() {
    setTimeout(() => this.spinner.show());
    this.rolService.obtenerRol(this.rolId).subscribe(rol => {
      this.spinner.hide();
      this.formGroup.get('nombre').setValue(rol.nombre);
      this.formGroup.get('codEstado').setValue(rol.codEstado);
      this.formGroup.get('codArea').setValue(rol.codArea);
      this.rol = rol;
      this.usuarios = rol.usuarios;
    });
    this.encuentraTodosArbol();
  }

  encuentraTodosArbol() {
    this.cargandoMenu = true;
    this.menuService.encuentraTodosArbol().subscribe(menus => {
      this.cargandoMenu = false;
      const rolMenuAutoris = this.rol.rolMenuAutoris;
      this.menus = menus;
      console.log(menus);
      console.log(rolMenuAutoris);
      for (const menu of this.menus) {
        for (const menuChildren of menu.children) {

          // For check menus
          for (const rolMenuAutori of rolMenuAutoris) {
            if (menuChildren.value == rolMenuAutori.menuId) {
              menuChildren.checked = true;
            }
          }
          // for check autorize
          if (menuChildren.autorizaciones) {
            for (const autorize of menuChildren.autorizaciones) {
              for (const rolMenuAutori of rolMenuAutoris) {
                if (autorize.id == rolMenuAutori.autorizacionId) {
                  autorize.checked = true;
                  this.autorizacionesElegidos.push(autorize.id);
                }
              }
            }
          }
          /*
          if (menuChildren.checked) {
            const item = menuChildren.autorizaciones.find(autori => autori.checked == true);
            if (!item) {
              mensajeError = `${menu.text} | ${menuChildren.text}, no se ha elegido ningúna autorización`;
              break;
            }
          }
          */
        }
      }

      this.items = this.menus.map(value => {
        return new TreeviewItem(value);
      });

    });
  }

  onSelectedChange($event: any[]) {
    this.valoresMenus = $event;
    this.menus.forEach(menu => menu.children.forEach(hijo => hijo.checked = false));
    if (this.valoresMenus.length > 0) {
      this.valoresMenus.forEach(valor1 => {
        this.menus.forEach(valor2 => {
          const item = valor2.children.find(hijo => hijo.value == valor1);
          if (item) {
            item.checked = true;
          }
        });
      });
    }
  }

  listarEstadosDeRegistro() {
    this.maestroService.listarEstadosDeRegistro().subscribe(res => this.estados = res);
  }

  onFilterChange(value: string) {
    // console.log('filter:', value);
  }

  regresar() {
    this.router.navigate(['/auth/seguridad/rol']);
  }

  /*
  desactivarGuardar() {
    return this.formGroup.invalid || this.formGroup.pending || this.valoresMenus.length == 0 || this.autorizacionesElegidos.length == 0;
  }
*/

  validarMenusConAlMenosUnRol(): string {
    let mensajeError = '';
    for (const menu of this.menus) {
      for (const menuChildren of menu.children) {
        if (menuChildren.checked) {
          console.log(menuChildren);
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

  filtrarMenus() {
    const menusAEnviar = [];
    for (const menu of this.menus) {
      for (const menuChildren of menu.children) {
        if (menuChildren.checked) {
          for (const autorizacion of menuChildren.autorizaciones) {
            if (autorizacion.checked) {
              const hijo = {menuId: autorizacion.menuId, autorizacionId: autorizacion.id};
              menusAEnviar.push(hijo);
            }
          }
        }
      }
    }
    return menusAEnviar;
  }

  actualizarRol() {
    if (this.formGroup.invalid || this.formGroup.pending || this.valoresMenus.length == 0 || this.autorizacionesElegidos.length == 0) {
      const mensajeError = this.validarMenusConAlMenosUnRol();
      if (mensajeError) {
        Swal.fire('', mensajeError, 'error');
        return;
      }
    }
    const rol: Rol = {
      id: this.rolId,
      nombre: this.formGroup.get('nombre').value,
      codEstado: this.formGroup.get('codEstado').value,
      codArea: this.formGroup.get('codArea').value
    };

    const rolMenuAutoris = this.filtrarMenus();
    const usuariosElegidos = [];
    this.usuarios.forEach(user => usuariosElegidos.push(user.id));
    const rolActualizar = {rol, rolMenuAutoris, usuarioIds: usuariosElegidos};
    this.spinner.show();
    this.rolService.actualizar(rolActualizar).subscribe(
      respuesta => {
        this.spinner.hide();
        if (respuesta.codigo == CONST.C_STR_CODIGO_SUCCESS) {
          this.toastr.success(respuesta.mensaje, '');
          this.regresar();
        } else {
          Swal.fire('', respuesta.mensaje || '', 'error');
        }
      }
    );

  }

  agregarUsuario() {
    const modal = this.ngbModal.open(RolBuscarUsuarioComponent, {size: 'xl', scrollable: true});
    modal.result.then(
      this.closeModalUsuariosAAdicionar.bind(this),
      this.closeModalUsuariosAAdicionar.bind(this)
    );
  }

  closeModalUsuariosAAdicionar(usuarios) {
    if (usuarios) {
      const lista: Usuario[] = usuarios;
      let c = 0;
      lista.forEach(item => {
        const i = this.usuarios.findIndex(value => value.id === item.id);
        if (i < 0) {
          this.usuarios.push(item);
          c++;
        }
      });
      this.toastr.success('Nro de usuarios que se agregaron a la lista: ' + c, '');
    }
  }

  eliminarUsuarioDelRol(id: number) {
    const index = this.usuarios.findIndex(value => value.id == id);
    if (index >= 0) {
      this.usuarios.splice(index, 1);
    }
  }

  loadAreas() {
    this.spinner.show();
    this.maestroService.listaTablaAreas().subscribe(
      res => {
        this.areas = res;
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
