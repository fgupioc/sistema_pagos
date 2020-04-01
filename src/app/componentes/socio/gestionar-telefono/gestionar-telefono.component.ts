import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaestroService } from '../../../servicios/sistema/maestro.service';

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
      typePhone:  ['c', Validators.required],
      codigoItem: ['', Validators.required],
      descripcion: [null, Validators.required],
      codCiudad: [null],
      operador: [null, Validators.required],
      anexo: [null],
    });
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
    const type = this.formulario.controls.typePhone.value;
    if (type == '1') {
      this.cell = true;
    } else {
      this.cell = false;
    }
  }
}
