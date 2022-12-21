import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {CONST} from '../../../../comun/CONST';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreditoService} from '../../../../servicios/estrategia/credito.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {AutenticacionService} from '../../../../servicios/seguridad/autenticacion.service';

@Component({
  selector: 'app-modal-buscar-socio-asignacion',
  templateUrl: './modal-buscar-socio-asignacion.component.html',
  styleUrls: ['./modal-buscar-socio-asignacion.component.css']
})
export class ModalBuscarSocioAsignacionComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  socios: {
    asignacionUuid: string,
    ejecutivoUuid: string,
    socioUuid: string,
    numeroCredito: string,
    codigoSocio: number,
    socio: string,
    ejecutivo: string,
    inicio: string,
    fin: string
  }[] = [];
  form: FormGroup;
  @Input() origen = 'S';

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private creditoService: CreditoService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public auth: AutenticacionService
  ) {
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.form = this.formBuilder.group({
      type: ['1'],
      number: ['', [Validators.maxLength(11), Validators.required]]
    });
  }

  get type() {
    return this.form.controls.type;
  }

  get number() {
    return this.form.controls.number;
  }

  findSocio() {
    this.socios = [];
    const data = this.form.getRawValue();
    this.spinner.show('findSocio');
    this.creditoService.buscarSocioEnAsignaciones(data).subscribe(
      res => {
        this.socios = res;
        this.spinner.hide('findSocio');
      },
      err => {
        console.log(err);
        this.spinner.hide('findSocio');
      }
    );

  }

  changeType() {
    this.number.setValue('');
  }

  ir(socio: any) {
    this.activeModal.close();
    let url = `/auth/estrategia/asignacion-cartera/${socio.ejecutivoUuid}/listado/${socio.asignacionUuid}/detalle/${socio.numeroCredito}/socio`;
    if (this.origen == 'E') {
      url = `/auth/gestion-administrativa/mis-gestiones/${socio.numeroCredito}/detalle`;
    }
    this.router.navigateByUrl(url);
  }
}
