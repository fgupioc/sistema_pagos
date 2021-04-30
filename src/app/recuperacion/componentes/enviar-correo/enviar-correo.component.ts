import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AutenticacionService} from '../../../servicios/seguridad/autenticacion.service';
import {CONST} from '../../../comun/CONST';
import {ToastrService} from "ngx-toastr";
import {EventosService} from "../../../servicios/eventos.service";

@Component({
  selector: 'app-enviar-correo',
  templateUrl: './enviar-correo.component.html',
  styleUrls: ['./enviar-correo.component.css']
})
export class EnviarCorreoComponent implements OnInit {
  @Input() showEmails: any[] = [];
  @Output() hideNewEmail = new EventEmitter<boolean>();
  @Output() emitirCorreo = new EventEmitter<any>();

  formCorreo: FormGroup;
  $body: string;
  config = CONST.C_CONF_EDITOR;

  constructor(
    public auth: AutenticacionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private eventosService: EventosService
  ) {
  }

  ngOnInit() {
    this.$body = `<p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p>${this.auth.loggedUser.alias}</p><p>${this.auth.loggedUser.email} </p><p>Ejecutivo de Negocio.</p>`;

    this.formCorreo = this.formBuilder.group({
      asunto: ['', [Validators.required, Validators.maxLength(220)]],
      correo: ['', [Validators.required]],
      mensaje: [this.$body, [Validators.required]],
      url: [false]
    });

    this.eventosService.enviarNotifyEmitter.subscribe(({send}) => (send) ? this.cancelar() : () => {});
  }

  get asunto() {
    return this.formCorreo.get('asunto');
  }

  get correo() {
    return this.formCorreo.get('correo');
  }

  get mensaje() {
    return this.formCorreo.get('mensaje');
  }

  cancelar() {
    this.formCorreo.reset({aunto: '', correo: '', mensaje: this.$body});
    this.hideNewEmail.emit(false);
  }

  envirMensaje() {
    if (this.formCorreo.invalid) {
      this.toastr.warning("Debe ingresar los datos obligatorios.");
      return;
    }

    const {asunto, correo, mensaje} = this.formCorreo.getRawValue();
    this.emitirCorreo.emit({asunto, correo, mensaje});
  }
}
