import {Component, OnInit} from '@angular/core';
import {TreeviewConfig, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Usuario} from '../../interfaces/Usuario';
import {NgxSpinnerService} from 'ngx-spinner';
import {MenuService} from '../../servicios/sistema/menu.service';
import {UsuarioService} from '../../servicios/sistema/usuario.service';
import {MaestroService} from '../../servicios/sistema/maestro.service';
import {RolService} from '../../servicios/rol.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AutorizacionService} from '../../servicios/autorizacion.service';
import {CONST} from '../../comun/CONST';
import {RolUnicoService} from '../../validaciones/rol-unico.directive';
import Swal from 'sweetalert2';
import {Rol} from '../../interfaces/rol';
import {RolBuscarUsuarioComponent} from '../rol-buscar-usuario/rol-buscar-usuario.component';
import {TablaMaestra} from '../../interfaces/tabla-maestra';

declare const $: any;

@Component({
  selector: 'app-rol-crear',
  templateUrl: './rol-crear.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolCrearComponent implements OnInit {

  public formGroup: FormGroup;
  estados = [];
  usuarios: Usuario[] = [];
  tipoEstadosCivil = [];

  menus = [];
  personaId = 0;
  cargandoMenu = false;
  items: TreeviewItem[];
  valoresMenus: string[] = [];
  dtOptions: DataTables.Settings = {};
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  autorizacionesElegidos = [];
  areas: TablaMaestra[] = [];

  constructor(private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private menuService: MenuService,
              private usuarioService: UsuarioService,
              private maestroService: MaestroService,
              private rolService: RolService,
              private autorizacionService: AutorizacionService,
              private toastr: ToastrService,
              private router: Router,
              private rutaActiva: ActivatedRoute,
              private rolUnicoService: RolUnicoService,
              private ngbModal: NgbModal,
  ) {
  }

  ngOnInit() {
    this.loadAreas();
    this.formGroup = this.formBuilder.group({
      nombre: ['', {
        validators: [Validators.required],
          asyncValidators: [this.rolUnicoService.validate.bind(this.rolUnicoService, 0)],
        updateOn: 'blur'
      }],
      codEstado: [CONST.S_ESTADO_REG_ACTIVO, [Validators.required]],
      codArea: ['', Validators.required]
    });
    this.listarEstadosDeRegistro();
    this.encuentraTodosArbol();
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
  }

  isSelectedAutorizacion(topic) {
    return this.autorizacionesElegidos.indexOf(topic) >= 0;
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

  encuentraTodosArbol() {
    this.cargandoMenu = true;
    this.menuService.encuentraTodosArbol().subscribe(menus => {
      this.cargandoMenu = false;
      this.menus = menus;
      this.items = this.menus.map(value => {
        return new TreeviewItem(value);
      });
    }, error => this.cargandoMenu = false);
  }

  onFilterChange(value: string) {
    console.log('filter:', value);
  }

  listarEstadosDeRegistro() {
    this.maestroService.listarEstadosDeRegistro().subscribe(res => this.estados = res);
  }

  regresar() {
    this.router.navigate(['/auth/seguridad/rol']);
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

  listarAutorizaciones(menuId: string) {
    // valoresMenus
    this.autorizacionService.porMenuId(menuId).subscribe(respuesta => {
      console.log(respuesta);
    });
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

  crear() {
    if (!this.desactivarGuardar()) {
      const mensajeError = this.validarMenusConAlMenosUnRol();
      if (mensajeError) {
        Swal.fire('', mensajeError, 'error');
        return;
      }

      const rol: Rol = {
        nombre: this.formGroup.get('nombre').value,
        codEstado: this.formGroup.get('codEstado').value,
        codArea:  this.formGroup.get('codArea').value,
      };

      const rolMenuAutoris = this.filtrarMenus();
      const usuariosElegidos = [];
      this.usuarios.forEach(user => usuariosElegidos.push(user.id));
      const rolNuevo = {rol, rolMenuAutoris, usuarioIds: usuariosElegidos};

      this.spinner.show();
      this.rolService.guardar(rolNuevo).subscribe(
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
  }

  desactivarGuardar() {
    console.log(this.formGroup.invalid);
    console.log(this.formGroup.pending);
    console.log(this.valoresMenus);
    console.log(this.autorizacionesElegidos);
    return this.formGroup.invalid || this.formGroup.pending || this.valoresMenus.length == 0 || this.autorizacionesElegidos.length == 0;
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
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
