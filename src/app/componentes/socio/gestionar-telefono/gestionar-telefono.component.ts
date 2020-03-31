import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestionar-telefono',
  templateUrl: './gestionar-telefono.component.html',
  styleUrls: ['./gestionar-telefono.component.css']
})
export class GestionarTelefonoComponent implements OnInit {
  formulario: FormGroup;
  accion: any;
  cell = true;

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      typePhone:  ['c', Validators.required],
      codigoItem: ['', Validators.required],
      descripcion: [null, Validators.required],
      codCiudad: [null],
      operador: [null, Validators.required],
      anexo: [null],
    });
  }

  cambioTypePhone() {
    const type = this.formulario.controls.typePhone.value;
    if (type == 'c') {
      this.cell = true;
    } else {
      this.cell = false;
    }
  }
}
