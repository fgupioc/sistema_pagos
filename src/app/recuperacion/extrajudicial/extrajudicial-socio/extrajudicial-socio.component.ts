import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtrajudicialService } from '../../../servicios/recuperacion/extrajudicial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONST } from 'src/app/comun/CONST';

@Component({
  selector: 'app-extrajudicial-socio',
  templateUrl: './extrajudicial-socio.component.html',
  styleUrls: ['./extrajudicial-socio.component.css']
})
export class ExtrajudicialSocioComponent implements OnInit {
  solicitudUuid: string;
  itemId: string;
  socio: any;
  seccioSeleccionada = '1';
  creditos: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private extrajudicialService: ExtrajudicialService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    const { solicitudUuid } = activatedRoute.snapshot.params;
    if (!solicitudUuid) {
      router.navigateByUrl('/auth/recuperacion/extrajudicial/solicitudes');
      return;
    }

    this.solicitudUuid = solicitudUuid;
    const state = router.getCurrentNavigation().extras.state;
    if(!state) {
      router.navigateByUrl('/auth/recuperacion/extrajudicial/solicitudes/' + solicitudUuid + '/socios');
      return;
    }

    if (!state.itemId) {
      router.navigateByUrl('/auth/recuperacion/extrajudicial/solicitudes/' + solicitudUuid + '/socios');
      return;
    }

    this.itemId = state.itemId;
    this.loadInfoSocio(solicitudUuid, state.itemId);
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
  }

  loadInfoSocio(uuid, id: any) {
    this.spinner.show();
    this.extrajudicialService.buscarInformacionSocio(uuid, id).subscribe(
      res => {
        if (res.exito) {
          this.socio = res.socio;
          this.creditos = res.creditos;
          this.refreshDatatable();
        }
        this.spinner.hide();
      },
      err => this.spinner.hide()
    );
  }

  tabSeleccionado(event: NgbTabChangeEvent) {
    this.seccioSeleccionada = event.nextId;
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
