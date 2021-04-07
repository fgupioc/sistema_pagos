import { Component, OnInit } from '@angular/core';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Cartera } from '../../../interfaces/cartera';
import { AuthorityService } from '../../../servicios/authority.service';

@Component({
  selector: 'app-extrajudicial-carteras',
  templateUrl: './extrajudicial-carteras.component.html',
  styleUrls: ['./extrajudicial-carteras.component.css']
})
export class ExtrajudicialCarterasComponent implements OnInit {
  carteras: Cartera[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private extrajudicialService: ExtrajudicialService,
    public AS: AuthorityService
  ) { }

  ngOnInit() {
    this.listarCarteras();
  }

  listarCarteras() {
    this.spinner.show();
    this.extrajudicialService.getCarteras().subscribe(
      res => {
        this.carteras = res;
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }
}
