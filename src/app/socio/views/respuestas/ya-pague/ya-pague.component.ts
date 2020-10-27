import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UbigeoService} from '../../../../servicios/sistema/ubigeo.service';

@Component({
  selector: 'app-ya-pague',
  templateUrl: './ya-pague.component.html',
  styleUrls: ['./ya-pague.component.css']
})
export class YaPagueComponent implements OnInit {
  ipAddress: any;

  constructor(
    public activeModal: NgbActiveModal,
    private ubigeoService: UbigeoService
  ) {
  }

  ngOnInit() {
    this.getIpAddress();
  }

  getIpAddress() {
    this.ubigeoService.getIpAddress().subscribe(({ip}) => this.ipAddress = ip);
  }

}
