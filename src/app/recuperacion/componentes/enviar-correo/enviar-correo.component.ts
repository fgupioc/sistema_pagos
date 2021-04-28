import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AutenticacionService } from '../../../servicios/seguridad/autenticacion.service';
import { CONST } from '../../../comun/CONST';

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
  config = CONST.C_CONF_EDITOR;

  constructor(
    public auth: AutenticacionService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.$body = `<p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p>${this.auth.loggedUser.alias}</p><p>${this.auth.loggedUser.email} </p><p>Ejecutivo de Negocio.< /p>`;

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
