import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaestroService } from '../../../servicios/sistema/maestro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-telefono',
  templateUrl: './gestionar-telefono.component.html',
  styleUrls: ['./gestionar-telefono.component.css']
})
export class GestionarTelefonoComponent implements OnInit {
  formulario: FormGroup;
  accion: any;
  cell = true;
  tipoTelefonos: any[] = [];
  tipoUsos: any[] = [];
  tipoOperadores: any[] = [];
  telefono: any;
  max = 9;

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) { }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 1);
    this.listarTipoTelefonos();
    this.listarTipoUso();
    this.listarTipoOperador();

    this.formulario = this.formBuilder.group({
      telefonoId: [],
      personaId: [],
      tipo: ['', Validators.required],
      codCiudad: [],
      numero: ['', [
        Validators.required,
        Validators.minLength(9)
      ]],
      anexo: [],
      codUso: ['', Validators.required],
      operador: ['', Validators.required],
      codEstado: [],
      canales: [],
      pais: []
    });

    if (this.accion == '1') {
      this.formulario.controls.canales.setValue([]);
    } else {
      this.telefono.canales = [];
      this.formulario.setValue(this.telefono);
      this.formulario.disable();
      if (this.telefono.tipo != '1') {
        this.cell = false;
      }
    }
  }
  listarTipoOperador() {
    this.maestroService.listarTipoOperador().subscribe(
      response => {
        this.tipoOperadores = response;
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }
  listarTipoUso() {
    this.maestroService.listarTipoUso().subscribe(
      response => {
        this.tipoUsos = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  listarTipoTelefonos() {
    this.maestroService.listarTipoTelefonos().subscribe(
      response => {
        this.tipoTelefonos = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  cambioTypePhone() {
    const type = this.formulario.controls.tipo.value;
    this.formulario.controls.numero.clearValidators();
    this.formulario.controls.codCiudad.clearValidators();
    if (type == '1') {
      this.cell = true;
      this.max = 9;
    } else {
      this.cell = false;
      this.max = 6;
      this.formulario.controls.codCiudad.setValidators(
        Validators.compose([
          Validators.required,
          Validators.maxLength(3)
        ]),
      );
      this.formulario.controls.codCiudad.updateValueAndValidity();
      this.formulario.controls.codCiudad.setValue('');
    }
    this.formulario.controls.numero.setValidators(
      Validators.compose([
        Validators.required,
        Validators.minLength(this.max)
      ]),
    );
    this.formulario.controls.numero.updateValueAndValidity();
    this.formulario.controls.numero.setValue('');
  }

  guardar() {
    const data = this.formulario.getRawValue();
    if (data.canales.length == 0) {
      Swal.fire('Correo', 'Debe seleccionar un canal.', 'error');
      return;
    }
    console.log(data);
  }

  cambiarCanal(event: any, codItem) {
    const index = this.formulario.controls.canales.value.findIndex(v => v.codItem == codItem);
    if (event.target.checked) {
      if (index == -1) {
        this.formulario.controls.canales.value.push({
          codItem
        });
      }
    } else {
      if (index >= 0) {
        this.formulario.controls.canales.value.splice(index, 1);
      }
    }
  }

  cambioCodigoCiudad() {
    const codLima = '01';
    const codigos = [
      '041', '043', '083', '054', '066', '076', '084', '067',
      '062', '056', '064', '044', '074', '065', '082', '053',
      '063', '073', '051', '042', '052', '072', '061'
    ];
    this.formulario.controls.numero.setValue('');
    const codigo = this.formulario.controls.codCiudad.value;
    if (codigo.length == 2) {
      if (codLima != codigo) {
        this.formulario.controls.codCiudad.setValue('');
        Swal.fire('Telefono', 'El código no es valido.', 'error');
        return;
      } else {
        this.max = 7;
        return;
      }
    } else if (codigo.length == 3) {
      if (codigos.indexOf(codigo) == -1) {
        this.formulario.controls.codCiudad.setValue('');
        Swal.fire('Telefono', 'El código no es valido.', 'error');
        return;
      } else {
        this.max = 6;
        return;
      }
    } else {
      this.formulario.controls.codCiudad.setValue('');
      Swal.fire('Telefono', 'El código no es valido.', 'error');
      return;
    }
  }
}
