import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AutenticacionService } from '../../../servicios/seguridad/autenticacion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-enviar-whatsapp',
  templateUrl: './enviar-whatsapp.component.html',
  styleUrls: ['./enviar-whatsapp.component.css']
})
export class EnviarWhatsappComponent implements OnInit {
  formWhatsapp: FormGroup;
  $body = '';
  @Input() showPhones: any[] = [];
  @Output() hideNewWhatsapp = new EventEmitter<boolean>();

  constructor(
    public auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    this.$body = `\n${this.auth.loggedUser.alias}\n${this.auth.loggedUser.email}\nEjecutivo de Negocio.`;
   }

  ngOnInit() {

    this.formWhatsapp = this.formBuilder.group({
      telefono: ['', [Validators.required]],
      mensaje: [this.$body, [Validators.required]],
      url: [false]
    });
  }

  cancelar() {
    this.formWhatsapp.reset({ numero: '', mensaje: this.$body });
    this.hideNewWhatsapp.emit(false);
  }
}
