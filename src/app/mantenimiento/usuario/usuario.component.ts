import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../../servicios/sistema/usuario.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CONST} from '../../comun/CONST';
import {HttpClient} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuarios: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(private usuarioService: UsuarioService, private spinner: NgxSpinnerService, private modalService: NgbModal,
              private router: Router) {
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
    this.encuentraTodos();
  }

  encuentraTodos() {
    /*
    const that = this;
    this.dtOptions = {
      // ajax: 'data/data.json',
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<any[]>(this.usuarioService.encuentraTodosUrl(), dataTablesParameters, {})
          .subscribe(resp => {
            console.log(resp);
            //that.persons = resp.data;
/*
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });

          });
      },
      // ajax: this.usuarioService.encuentraTodosUrl,
      /*
      columns: [{
        title: '#',
        data: 'id'
      }, {
        title: 'Usuario',
        data: 'firstName'
      }, {
        title: 'T. Usuario',
        data: 'lastName'
      }]
    };
*/
    this.spinner.show();
    this.usuarioService.encuentraTodos().subscribe(
      res => {
        this.spinner.hide();
        this.usuarios = res;
        this.refreshDatatable();
      });

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

  crear() {
    this.router.navigate(['/auth/mantenimiento/usuario/crear']);
  }

  editar(usuarioId: number) {
    this.router.navigate(['/auth/mantenimiento/usuario/editar', usuarioId]);
  }


  estaActivo(codEstado: string) {
    return codEstado === CONST.S_ESTADO_REG_ACTIVO;
  }
}
