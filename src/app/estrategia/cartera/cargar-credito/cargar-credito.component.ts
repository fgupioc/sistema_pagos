import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CarteraCargarCreditoFileComponent} from './file/file.component';

@Component({
  selector: 'app-cargar-credito',
  templateUrl: './cargar-credito.component.html',
  styleUrls: ['./cargar-credito.component.css']
})
export class CarteraCargarCreditoComponent implements OnInit {

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  resetear() {

  }

  cargarArchivo() {
    const modal = this.modalService.open(CarteraCargarCreditoFileComponent, {centered: true});
    modal.result.then(this.modalClose.bind(this), this.modalClose.bind(this));
  }

  modalClose(response) {
    if (response) {
      // reloadlist
    }
  }

  ejecutarCarga() {

  }
}
