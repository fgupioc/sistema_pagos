import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CarteraService} from '../../../../servicios/estrategia/cartera.service';
import Swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {CreditoService} from '../../../../servicios/estrategia/credito.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class CarteraCargarCreditoFileComponent implements OnInit {
  formGroup: FormGroup;
  carterasActivas = [];
  archivo;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private toastr: ToastrService,
              private carteraService: CarteraService, private creditoService: CreditoService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      cartera: ['', [Validators.required]],
      archivo: ['', [Validators.required]]
    });
    this.listarCarterasActivas();
  }

  cargarCreditos() {
    if (this.formGroup.valid) {
      const formData = new FormData();
      formData.append('archivo', this.archivo);
      formData.append('carteraId', this.formGroup.get('cartera').value);

      this.spinner.show();
      this.creditoService.cargarManualmente(formData).subscribe(
        respuesta => {
          this.spinner.hide();
          if (respuesta.exito) {
            this.toastr.success(respuesta.mensaje, '');
            this.activeModal.dismiss(true);
          } else {
            Swal.fire('', respuesta.mensaje || '', 'error');
          }
        }
      );
    }
  }

  private listarCarterasActivas() {
    this.carteraService.activas().subscribe(res => this.carterasActivas = res);
  }

  onFileChange(event) {
    this.archivo = null;
    if (event.target.files.length > 0) {
      this.archivo = event.target.files[0];
    }
  }
}
