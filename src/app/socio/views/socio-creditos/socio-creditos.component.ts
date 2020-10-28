import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SocioInvitadoService} from '../../../servicios/socio/socio-invitado.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-socio-creditos',
  templateUrl: './socio-creditos.component.html',
  styleUrls: ['./socio-creditos.component.css']
})
export class SocioCreditosComponent implements OnInit {
  token: string;
  creditos: any[] = [];
  socio: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private socioInvitadoService: SocioInvitadoService,
    private spinner: NgxSpinnerService
  ) {
    activatedRoute.params.subscribe(({token}) => this.token = token);
  }

  ngOnInit() {
    if (this.token) {
      this.misCreditos();
    }
  }

  misCreditos() {
    this.spinner.show();
    this.socioInvitadoService.misCreditos(this.token).subscribe(
      res => {
        console.log(res);
        if (res.exito) {
          this.creditos = res.objeto;
          this.socio = res.socio;
        }
        this.spinner.hide();
      }
    );
  }
}
