import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AutenticacionService } from '../../../servicios/seguridad/autenticacion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enviar-sms',
  templateUrl: './enviar-sms.component.html',
  styleUrls: ['./enviar-sms.component.css']
})
export class EnviarSmsComponent implements OnInit {
  formSMS: FormGroup;
  @Input() showPhones: any[] = [];
  @Output() hideNewSMS = new EventEmitter<boolean>();

  constructor(
    public auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {

    this.formSMS = this.formBuilder.group({
      telefono: ['', [Validators.required]],
      mensaje: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  cancelar() {
    this.formSMS.reset({ telefono: '', mensaje: '' });
    this.hideNewSMS.emit(false);
  }

  get mensaje() { return this.formSMS.get('mensaje'); }
  get telefono() { return this.formSMS.get('telefono'); }

  envirMensaje() {
    if(this.formSMS.invalid) {
      this.toastr.warning("Debe ingresar los datos obligatorios.");
      return;
    }

    const { telefono, mensaje } = this.formSMS.getRawValue();
    console.log(telefono);
    console.log(mensaje);
  }
}
