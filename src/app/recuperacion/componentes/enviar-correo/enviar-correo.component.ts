import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AutenticacionService } from '../../../servicios/seguridad/autenticacion.service';

@Component({
  selector: 'app-enviar-correo',
  templateUrl: './enviar-correo.component.html',
  styleUrls: ['./enviar-correo.component.css']
})
export class EnviarCorreoComponent implements OnInit {
  @Input() showEmails: any[] = [];
  @Output() hideNewEmail = new EventEmitter<boolean>();
  formCorreo: FormGroup;
  $body: string;

  constructor(
    public auth: AutenticacionService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.$body = `\n${this.auth.loggedUser.alias}\n${this.auth.loggedUser.email}\nEjecutivo de Negocio.`;
    this.formCorreo = this.formBuilder.group({
      asunto: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      mensaje: [this.$body, [Validators.required]],
      url: [false]
    });
  }


  ocultar() {
    this.formCorreo.reset({ aunto: '', correo: '', mensaje: this.$body });
    this.hideNewEmail.emit(false);
  }
}
