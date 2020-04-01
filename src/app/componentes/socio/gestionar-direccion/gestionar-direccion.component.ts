import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CONST } from '../../../comun/CONST';
import Swal from 'sweetalert2';
import { MaestroService } from '../../../servicios/sistema/maestro.service';
import { UbigeoService } from '../../../servicios/sistema/ubigeo.service';

@Component({
  selector: 'app-gestionar-direccion',
  templateUrl: './gestionar-direccion.component.html',
  styleUrls: ['./gestionar-direccion.component.css']
})
export class GestionarDireccionComponent implements OnInit {
  direcciones: any[] = [];
  miDireccion: any;
  accion: any;
  form: FormGroup;
  tipoViviendas: any[] = [];
  tipoVias: any[] = [];
  tipoSecciones: any[] = [];
  tipoZonas: any[] = [];
  tiposSectores: any[] = [];
  tipoDirecciones: any[] = [];

  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];

  $sectionName = 'SECCIÓN';
  $zoneName = 'ZONA';
  $sectorName = 'SECTOR';
  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private maestroService: MaestroService,
    private ubigeoService: UbigeoService
  ) { }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 1);
    this.listarTipoDirecciones();
    this.listarTipoviviendas();
    this.listarTipoVias();
    this.listarTipoSecciones();
    this.listarTipoZonas();
    this.listarTipoSectores();
    this.listarDepartamentos();

    this.form = this.formBuilder.group({
      tipoDireccion: ['', Validators.required],
      tipoVivienda: ['', Validators.required],
      tipoVia: ['', Validators.required],
      nombreVia: ['', Validators.required],
      numero: [''],
      manzana: [''],
      lote: [''],
      tipoSeccion: [''],
      numeroSeccion: [''],
      tipoZona: ['', Validators.required],
      nombreZona: ['', Validators.required],
      tipoSector: [''],
      nombreSector: [''],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
    });
  }

  listarTipoDirecciones() {
    this.maestroService.listarTipoDirecciones().subscribe(
      response => {
        this.tipoDirecciones = response;
      },
      error => console.log(error)
    );
  }

  listarTipoviviendas() {
    this.maestroService.listarTipoViviendas().subscribe(
      response => {
        this.tipoViviendas = response;
      },
      error => console.log(error)
    );
  }

  listarTipoVias() {
      this.maestroService.listarTipoVias().subscribe(
          response => {
              this.tipoVias = response;
          },
          error => console.log(error)
      );
  }

  listarTipoSecciones() {
      this.maestroService.listarTipoSecciones().subscribe(
          response => {
              this.tipoSecciones = response;
          },
          error => console.log(error)
      );
  }

  listarTipoZonas() {
      this.maestroService.listarTipoZonas().subscribe(
          response => {
              this.tipoZonas = response;
          },
          error => console.log(error)
      );
  }

  listarTipoSectores() {
    this.maestroService.listarTipoSectores().subscribe(
        response => {
            this.tiposSectores = response;
        },
        error => console.log(error)
    );
}

  listarDepartamentos() {
    this.ubigeoService.listarDepartamentos().subscribe(
        response => {
            this.departamentos = response;
            this.spinner.hide();
        },
        error => console.log(error)
    );
  }

  listarProvincias() {
    this.spinner.show();
    this.provincias = [];
    this.distritos = [];
    this.form.controls.provincia.setValue(null);
    this.form.controls.distrito.setValue(null);
    const codDepartamento = this.form.controls.departamento.value;
    if (codDepartamento) {
        this.ubigeoService.listarProvincias(codDepartamento).subscribe(
            response => {
                this.provincias = response;
                this.spinner.hide();
            },
            error => console.log(error)
        );
    }
  }

  listarDistritos() {
    this.spinner.show();
    this.distritos = [];
    this.form.controls.distrito.setValue(null);

    const codDepartamento = this.form.controls.departamento.value;
    const codProvincia = this.form.controls.provincia.value;
    if (codDepartamento && codProvincia) {
        this.ubigeoService.listarDistritos(codDepartamento, codProvincia).subscribe(
            response => {
                this.distritos = response;
                this.spinner.hide();
            },
            error => console.log(error)
        );
    }
  }

  cambioManzana(value: any) {
    if (value.length > 0) {
      this.form.controls.lote.setValidators(
        Validators.compose([
          Validators.required
        ]),
      );
      this.form.controls.lote.updateValueAndValidity();
    } else {
      this.form.controls.lote.clearValidators();
      this.form.controls.lote.updateValueAndValidity();
      this.form.controls.lote.setValue('');
    }
  }

  cambioTipoSeccion(value: any) {
    if (Number(value) !== 0) {
      this.form.controls.numeroSeccion.setValidators(
        Validators.compose([
          Validators.required,
          Validators.pattern(CONST.C_STR_EXP_REGULAR_NUMERO)
        ]),
      );
      this.form.controls.numeroSeccion.updateValueAndValidity();
      const item = this.tipoSecciones.find(v => v.codItem == value);
      this.$sectionName = item ? item.descripcion : 'Sección';
    } else {
      this.form.controls.numeroSeccion.clearValidators();
      this.form.controls.numeroSeccion.updateValueAndValidity();
      this.form.controls.numeroSeccion.setValue('');
      this.$sectionName = 'Sección';
    }
  }

  cambioTipoZona(value) {
    if (Number(value) !== 0) {
      const item = this.tipoZonas.find(v => v.codItem == value);
      this.$zoneName = item ? item.descripcion : 'Zona';
    } else {
      this.$zoneName = 'Zona';
    }
  }

  cambioTipoSector(value: any) {
    if (Number(value) !== 0) {
      this.form.controls.nombreSector.setValidators(
        Validators.compose([
          Validators.required
        ]),
      );
      this.form.controls.nombreSector.updateValueAndValidity();
      const item = this.tiposSectores.find(v => v.codItem == value);
      this.$sectorName = item ? item.descripcion : 'Sector';
    } else {
      this.form.controls.nombreSector.clearValidators();
      this.form.controls.nombreSector.updateValueAndValidity();
      this.form.controls.nombreSector.setValue('');
      this.$sectorName = 'Sector';
    }
  }

  agregar() {
    if (this.form.invalid) {
      Swal.fire('Dirección', 'Debe ingresar los datos obligatorios', 'error');
      return;
    }

    if (this.form.controls.numero.value.length === 0 && this.form.controls.manzana.value.length === 0
      && this.form.controls.lote.value.length === 0) {
      this.toastr.error('Es necesario ingresar un número o Manzana y lote.', 'Registrar Dirección');
      return;
    }
    let address: any;
    address.tipoDireccion = this.form.controls.tipoDireccion.value.toUpperCase();
    address.tipoVivienda = this.form.controls.tipoVivienda.value.toUpperCase();
    address.tipoVia = this.form.controls.tipoVia.value.toUpperCase();
    address.nombreVia = this.form.controls.nombreVia.value.toUpperCase();
    address.numero = this.form.controls.numero.value.toUpperCase();
    address.manzana = this.form.controls.manzana.value.toUpperCase();
    address.lote = this.form.controls.lote.value.toUpperCase();
    address.tipoSeccion = this.form.controls.tipoSeccion.value.toUpperCase();
    address.numeroSeccion = this.form.controls.numeroSeccion.value.toUpperCase();
    address.tipoZona = this.form.controls.tipoZona.value.toUpperCase();
    address.nombreZona = this.form.controls.nombreZona.value.toUpperCase();
    address.tipoSector = this.form.controls.tipoSector.value.toUpperCase();
    address.nombreSector = this.form.controls.nombreSector.value.toUpperCase();
    address.ubigeo = this.form.controls.departamento.value + this.form.controls.provincia.value + this.form.controls.distrito.value;
    address.estado = CONST.S_ESTADO_REG_ACTIVO;



    address.departamento = this.departamentos.find(value => value.codDepartamento == this.form.controls.departamento.value).descripcion;
    address.provincia = this.provincias.find(value => value.codProvincia == this.form.controls.provincia.value).descripcion;
    address.distrito = this.distritos.find(value => value.codDistrito == this.form.controls.distrito.value).descripcion;
    // ------------------------------------------

    this.direcciones.push(address);
    this.toastr.success('Se agrego a la lista.', 'Dirección');
    this.activeModal.dismiss({ direcciones: this.direcciones, tipoDirecciones: this.tipoDirecciones });
  }
}
