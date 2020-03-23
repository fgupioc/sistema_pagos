import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { ActualizarEtapaComponent } from '../../etapa/actualizar-etapa/actualizar-etapa.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-actualizar-gestion',
  templateUrl: './actualizar-gestion.component.html',
  styleUrls: ['./actualizar-gestion.component.css']
})
export class ActualizarGestionComponent implements OnInit {
  formGestion: FormGroup;
  campos: any[] = [];
  etapas: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private carteraService: CarteraService,
    public modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getCampos();
    this.formGestion = this.formBuilder.group({
      codGestion: [''],
      codCartera: [1],
      codCampoCartera: [''],
      nombre: [''],
      grupo: [''],
      desde: [''],
      hasta: [''],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [''],
    });
  }

  getCampos() {
    this.carteraService.listarCampos().subscribe(
      response => {
        if (response.exito) {
          this.campos = response.objeto;
        }
      }
    );
  }

  guardar() { 

    const data: any = this.formGestion.getRawValue();
    if (this.etapas.length === 0) {
      alert('Se necesita registrar etapas');
      return;
    }
    data.etapas = this.etapas; 

    this.carteraService.crearGestion(data).subscribe(
      response => {
        if (response.exito) {
          this.campos = response.objeto;
          this.toastr.success('Se registro con exito.')
          this.router.navigate(['/auth/estrategia/cartera']);
        } else {
          Swal.fire('Registro', response.mensaje, 'error');
        }
      }
    );
  }

  nuevaEtapa() {
    const modal = this.modalService.open(ActualizarEtapaComponent, { size: 'lg' });
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    modal.componentInstance.etapas = this.etapas;
  }

  closeModal(data) {
    console.log(this.etapas)
  }
}
