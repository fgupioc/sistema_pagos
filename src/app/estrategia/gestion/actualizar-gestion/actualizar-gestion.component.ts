import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CarteraService } from '../../../servicios/estrategia/cartera.service';
import { ActualizarEtapaComponent } from '../../etapa/actualizar-etapa/actualizar-etapa.component';

@Component({
  selector: 'app-actualizar-gestion',
  templateUrl: './actualizar-gestion.component.html',
  styleUrls: ['./actualizar-gestion.component.css']
})
export class ActualizarGestionComponent implements OnInit {
  formGestion: FormGroup;
  campos: any[] = [];
  tareas: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private carteraService: CarteraService,
    public modalService: NgbModal
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
    this.carteraService.crearGestion(data).subscribe(
      response => {
        if (response.exito) {
          this.campos = response.objeto;
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
    modal.componentInstance.tareas = this.tareas;
  }

  closeModal(data) {
    console.log(this.tareas)
  }
}
