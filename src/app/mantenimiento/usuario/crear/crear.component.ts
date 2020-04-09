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
import {PersonaService} from '../../../servicios/persona.service';

@Component({
  selector: 'app-usuario-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class UsuarioCrearComponent implements OnInit {
  public formGroup: FormGroup;
  tiposUsuarios = [];
  listaSexo = [];
  listaDoi = [];
  estados = [];
  tipoEstadosCivil = [];
  datePipe = new DatePipe('es-PE');
  maximoValor = 8;
  personaId = 0;
  cargandoMenu = false;
  items: TreeviewItem[];
  valoresMenus: number[] = [];
  private messageDocIdInvalid = '';
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });


  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private menuService: MenuService,
              private usuarioUnicoService: UsuarioUnicoService, private toastr: ToastrService, private router: Router,
              private rutaActiva: ActivatedRoute, private personaService: PersonaService,
              private usuarioService: UsuarioService, private maestroService: MaestroService) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      tipoDocIdentidad: [''],
      numDocIdentidad: ['', [Validators.required, Validators.minLength(this.maximoValor), Validators.pattern('^\\d+$')]],
      primerNombre: ['', [Validators.required, Validators.pattern(CONST.REG_EXP_SOLO_LETRAS)]],
      segundoNombre: ['', [Validators.pattern(CONST.REG_EXP_SOLO_LETRAS)]],
      primerApellido: ['', [Validators.required, Validators.pattern(CONST.REG_EXP_SOLO_LETRAS)]],
      segundoApellido: ['', [Validators.pattern(CONST.REG_EXP_SOLO_LETRAS)]],
      numeroCelular: ['', [Validators.required, Validators.pattern('^\\d+$'), Validators.maxLength(9)]],
      estadoCivil: [''],
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.usuarioUnicoService.validate.bind(this.usuarioUnicoService, 0)],
        updateOn: 'blur'
      }],
      fechaInicioSesion: ['', [Validators.required]],
      fechaFinSesion: ['', [Validators.required]],
      codTipoUsuario: ['', [Validators.required]],
      codEstado: ['', [Validators.required]],
      inicioCierre: [false],
      contrasenha: ['', [Validators.required, Validators.minLength(this.contrasenhaLongitudMinima()),
        Validators.pattern(CONST.REG_EXP_CONTRASENHA)]],
      confirmarContrasenha: ['', [Validators.required]],
    });
    this.formGroup.get('fechaInicioSesion').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.listarTiposDeUsuarios();
    this.listarEstadosDeRegistro();
    this.encuentraTodosArbol();

    this.listarTipoDocumentos();
    this.listarTipoSexos();
    this.listarTipoEstadosCivil();
  }

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
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.minLength(8),
            ]),
          );
          break;
        case '4': // CARNET DE EXTRANJERIA
          this.maximoValor = 12;
          this.messageDocIdInvalid = 'El número de documento debe tener hasta 12 caracteres';
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.minLength(2),
              Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
            ]),
          );
          break;
        case '6': // RUC
          this.maximoValor = 11;
          this.messageDocIdInvalid = 'El número de documento debe tener 11 dígitos';
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.minLength(11),
            ]),
          );
          break;
        case '7': //  PASAPORTE
          this.maximoValor = 12;
          this.messageDocIdInvalid = 'El número de documento debe tener hasta 12 caracteres';
          this.formGroup.get('numDocIdentidad').setValidators(
            Validators.compose([
              Validators.required,
              Validators.minLength(2),
              Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
            ]),
          );
          break;
        case '11': //  PARTIDA DE NACIMIENTO
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
      const persona = {fechaNacimiento: this.formGroup.get('fechaNacimiento').value};
      const personaNatural = {
        primerNombre: this.formGroup.get('primerNombre').value,
        segundoNombre: this.formGroup.get('segundoNombre').value,
        primerApellido: this.formGroup.get('primerApellido').value,
        segundoApellido: this.formGroup.get('segundoApellido').value,
        codSexo: this.formGroup.get('sexo').value,
        estadoCivil: this.formGroup.get('estadoCivil').value
      };
      const personaIdentificacion = {
        codTipoDocIdentificacion: this.formGroup.get('tipoDocIdentidad').value,
        numeroDocumentoIdentificacion: this.formGroup.get('numDocIdentidad').value,
      };
      const usuario = {
        personaId: this.personaId,
        codTipoUsuario: this.formGroup.get('codTipoUsuario').value,
        email: this.formGroup.get('email').value,
        contrasenha: this.formGroup.get('contrasenha').value,
        numeroCelular: this.formGroup.get('numeroCelular').value,
        fechaInicioSesion: this.formGroup.get('fechaInicioSesion').value,
        fechaFinSesion: this.formGroup.get('fechaFinSesion').value,
        inicioCierre: this.formGroup.get('inicioCierre').value,
        codEstado: this.formGroup.get('codEstado').value,
      };
      const usuarioNuevo = {
        persona,
        personaNatural,
        personaIdentificacion,
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

  buscarPersonaPorDocId() {
    const tipDoi: string = this.formGroup.get('tipoDocIdentidad').value;
    const numDoi: string = this.formGroup.get('numDocIdentidad').value;

    this.personaId = 0;

    if (this.formGroup.get('tipoDocIdentidad').valid && this.formGroup.get('numDocIdentidad').valid) {
      this.personaService.buscarPersonaPorDocId(tipDoi, numDoi).subscribe(
        result => {
          if (result != null) {
            this.personaId = result.personaId;
            this.formGroup.get('primerNombre').disable();
            this.formGroup.get('primerNombre').setValue(result.primerNombre);
            this.formGroup.get('segundoNombre').disable();
            this.formGroup.get('segundoNombre').setValue(result.segundoNombre);
            this.formGroup.get('primerApellido').disable();
            this.formGroup.get('primerApellido').setValue(result.primerApellido);
            this.formGroup.get('segundoApellido').disable();
            this.formGroup.get('segundoApellido').setValue(result.segundoApellido);
            this.formGroup.get('sexo').disable();
            this.formGroup.get('sexo').setValue(result.codSexo);
            this.formGroup.get('estadoCivil').disable();
            this.formGroup.get('estadoCivil').setValue(result.estadoCivil);
            this.formGroup.get('fechaNacimiento').disable();
            this.formGroup.get('fechaNacimiento').setValue(this.datePipe.transform(result.fechaNacimiento, 'yyyy-MM-dd'));
            if (result.correo != null) {
              this.formGroup.get('email').setValue(result.correo);
              this.formGroup.get('email').disable();
            }
            if (result.telefonoMovil != null) {
              this.formGroup.get('numeroCelular').setValue(result.telefonoMovil);
              this.formGroup.get('numeroCelular').disable();
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
