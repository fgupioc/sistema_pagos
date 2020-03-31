import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestionar-correo',
  templateUrl: './gestionar-correo.component.html',
  styleUrls: ['./gestionar-correo.component.css']
})
export class GestionarCorreoComponent implements OnInit {
  formulario: FormGroup;
  accion: any;

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      codigoItem: ['', Validators.required],
      correo: [null, Validators.required],
    });
  }

}
