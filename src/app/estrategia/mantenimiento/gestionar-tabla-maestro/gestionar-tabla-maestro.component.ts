import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {ModalMaestroComponent} from '../modal-maestro/modal-maestro.component';

@Component({
  selector: 'app-gestionar-tabla-maestro',
  templateUrl: './gestionar-tabla-maestro.component.html',
  styleUrls: ['./gestionar-tabla-maestro.component.css']
})
export class GestionarTablaMaestroComponent implements OnInit {
  codTable: number;
  title: string;
  items: TablaMaestra[] = [];

  create = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private maestroService: MaestroService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    const {codTable, title} = activatedRoute.snapshot.data;
    if (isNullOrUndefined(codTable)) {
      route.navigateByUrl('/auth/dashboard');
    } else {
      this.codTable = codTable;
      this.title = title;
      this.loadElements(codTable);
    }
  }

  ngOnInit() {
  }

  loadElements(id: string) {
    this.spinner.show();
    this.maestroService.listarElementosPorCodTable(id).subscribe(
      res => {
        this.items = res;
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  cambiarEstado(item: TablaMaestra, state: number) {
    const estado = state == 1 ? 'Desactivar' : 'Activar';
    Swal.fire({
      text: `${estado} el elemento seleccionado.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ' + estado,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.maestroService.cambiarEstado(item, String(state)).subscribe(
          res => {
            if (res.exito) {
              Swal.fire('', res.mensaje, 'success');
              this.loadElements(String(this.codTable));
            } else {
              Swal.fire('', res.mensaje, 'error');
            }
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
      }
    });

  }

  showModalCreate() {
    const modal = this.modalService.open(ModalMaestroComponent, {centered: true});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    modal.componentInstance.items = this.items;
    modal.componentInstance.codTable = this.codTable;
  }

  showModalEdit(item: any) {
    const modal = this.modalService.open(ModalMaestroComponent, {centered: true});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    modal.componentInstance.items = this.items;
    modal.componentInstance.item = item;
    modal.componentInstance.create = false;
    modal.componentInstance.codTable = this.codTable;
  }

  closeModal(data: any) {
    if (data) {
      this.loadElements(String(this.codTable));
    }
  }
}
