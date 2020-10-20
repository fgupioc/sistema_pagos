import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EjecutivoCartera} from '../../../models/ejecutivo-cartera';
import {NgxSpinnerService} from 'ngx-spinner';
import {AsignacionCarteraService} from '../../../servicios/asignacion-cartera.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../comun/CONST';

@Component({
  selector: 'app-modal-agregar-credito',
  templateUrl: './modal-agregar-credito.component.html',
  styleUrls: ['./modal-agregar-credito.component.css']
})
export class ModalAgregarCreditoComponent implements OnInit {
  data: EjecutivoCartera = {
    codUsuario: null,
    cartera: null,
    etapaItems: [],
    campoItems: [],
    sociosOpcional: [],
    creditosAsignados: [],
    startDate: null,
    endDate: null,
    frecuencia: null,
    creditosTemp: [],
  };

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  $creditos: any[] = [];
  $creditosCheched: any[] = [];
  creditosAsignacion: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private asignacionService: AsignacionCarteraService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    setTimeout(() => this.spinner.show(), 100);
    if (this.data.cartera.codCartera) {
      const data = this.data;
      data.creditosAsignados = [];
      data.sociosOpcional = [];
      data.creditosTemp = [];
      this.asignacionService.buscarCreditosPorFiltro(data.cartera.codCartera, data).subscribe(
        res => {
          this.$creditos = res;
          this.spinner.hide();
          this.refreshDatatable();
        },
        err => this.spinner.hide()
      );
    }
    console.log(this.creditosAsignacion);
  }

  changeCheckCreditos(event: any, credito: any) {
    const exist = this.$creditosCheched.find(i => i.id == credito.id);
    if (event.target.checked) {
      if (!exist) {
        this.$creditosCheched.push(credito);
      }
    } else {
      this.$creditosCheched = this.$creditosCheched.filter(i => i.id != credito.id);
    }
  }

  existe(credito: any) {
    return this.creditosAsignacion.find(i => i.id == credito.id);
  }

  guardar() {
    if (this.$creditosCheched.length == 0) {
      Swal.fire('Agregar Créditos', 'Debe seleccionar almenos un créditos.', 'warning');
      return;
    }
    this.spinner.show();
    this.asignacionService.agregarCreditosAsignnacionPorId(this.$creditosCheched, this.data.id).subscribe(
      res => {
        if (res.exito) {
          this.activeModal.dismiss(res);
        } else {
          this.spinner.hide();
        }
      },
      err => {
        Swal.fire('Agregar Crédito', err, 'error');
        this.spinner.hide();
      }
    );
  }

  refreshDatatable() {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }
}
