import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaestroService } from '../../../servicios/sistema/maestro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-correo',
  templateUrl: './gestionar-correo.component.html',
  styleUrls: ['./gestionar-correo.component.css']
})
export class GestionarCorreoComponent implements OnInit {
  formulario: FormGroup;
  accion: any;
  tipoUsos: any[] = [];
  correos: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private maestroService: MaestroService
  ) { }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 1);
    this.listarTipoUso();
    this.formulario = this.formBuilder.group({
      personaId: [],
      tipo: ['', Validators.required],
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      codEstado: ['1'],
      canales: []
    });
    if (this.accion == '1') {
      this.formulario.controls.canales.setValue([]);
    }
  }
  listarTipoUso() {
    this.maestroService.listarTipoUso().subscribe(
      response => {
        this.tipoUsos = response;
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  guardar() {
    const data = this.formulario.getRawValue();
    if (data.canales.length == 0) {
      Swal.fire('Correo', 'Debe seleccionar un canal.', 'error');
      return;
    }
    this.correos.push(data);
    this.activeModal.dismiss(this.correos);
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
}
