import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AutenticacionService } from '../../../servicios/seguridad/autenticacion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventosService } from '../../../servicios/eventos.service';

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
  @Output() emitirWhatsApp = new EventEmitter<any>();

  constructor(
    public auth: AutenticacionService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private eventosService: EventosService
  ) {
   }

  ngOnInit() {
    this.formWhatsapp = this.formBuilder.group({
      telefono: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
      url: [false]
    });
    this.eventosService.enviarNotifyEmitter.subscribe(({ send }) => (send) ? this.cancelar() : () => { });
  }

  get mensaje() { return this.formWhatsapp.get('mensaje'); }
  get telefono() { return this.formWhatsapp.get('telefono'); }

  cancelar() {
    this.formWhatsapp.reset({ telefono: '', mensaje: '' });
    this.hideNewWhatsapp.emit(false);
  }

  envirMensaje() {
    if (this.formWhatsapp.invalid) {
      this.toastr.warning("Debe ingresar los datos obligatorios.");
      return;
    }

    const { telefono, mensaje } = this.formWhatsapp.getRawValue();
    this.emitirWhatsApp.emit({ telefono, mensaje });
  }
}
