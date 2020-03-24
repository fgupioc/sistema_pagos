import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CONST} from '../../../../comun/CONST';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class CarteraCargarCreditoFileComponent implements OnInit {
  formGroup: FormGroup;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      cartera: ['', [Validators.required]],
      archivo: ['', [Validators.required]],
    });
  }

  cargarArchivo() {

  }
}
