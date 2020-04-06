import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EmailService} from '../../../servicios/email.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-socio-list-emails',
  templateUrl: './list-emails.component.html',
  styleUrls: ['./list-emails.component.css']
})
export class SocioListEmailsComponent implements OnInit {
  emails = [];
  socioId = 0;

  constructor(public activeModal: NgbActiveModal, private emailService: EmailService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.spinner.show();
    this.emailService.porSocioId(this.socioId).subscribe(
      res => {
        this.spinner.hide();
        this.emails = res;
      });
  }

}
