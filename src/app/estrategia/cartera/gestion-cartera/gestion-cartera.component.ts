import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Cartera} from '../../../interfaces/cartera';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import Swal from 'sweetalert2';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-gestion-cartera',
  templateUrl: './gestion-cartera.component.html',
  styleUrls: ['./gestion-cartera.component.css']
})
export class GestionCarteraComponent implements OnInit {
  formGestion: FormGroup;
  cartera: Cartera;
  create = true;
  gestiones: any[] = [];
  gestion;
  $etapas: any[] = [];
  $etapa;

  constructor(
    private formBuilder: FormBuilder,
    private carteraService: CarteraService,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    const data = router.getCurrentNavigation().extras.state;
    if (data && data.cartera) {
      this.cartera = data.cartera;
      this.create = data.update || true;
    } else {
      router.navigateByUrl('/auth/estrategia/carteras');
    }
  }

  ngOnInit() {
    this.listarGestiones();
    this.formGestion = this.formBuilder.group({
      codGestion: [''],
      desde: [{value: '', disabled: true}, [Validators.required]],
      hasta: [{value: '', disabled: true}, [Validators.required]],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      etapas: [],
      codEtapaTemp: [],
      desdeTemp: [],
      hastaTemp: [],
    });

    if (!this.gestion) {
      this.formGestion.controls.desde.disable();
      this.formGestion.controls.hasta.disable();
    }
  }


  validarDesde() {
    this.formGestion.controls.hasta.setValue(0);
    const desde = Number(this.formGestion.controls.desde.value);

    if (this.create) {
      if (this.gestiones.length > 0) {
        let flag = true;
        this.gestiones.forEach(v => {
          if (desde <= v.hasta) {
            flag = false;
          }
        });
        if (!flag) {
          Swal.fire('Crear Gestión', 'La cantidad del campo desde no es valido.', 'error');
          this.formGestion.controls.desde.setValue(0);
          return;
        }
      }
    } else {
      const gestiones = this.gestiones.filter(v => v.codGestion < this.gestion.codGestion);
      if (gestiones.length > 0) {
        let flag = true;
        gestiones.forEach(v => {
          if (desde <= v.hasta) {
            flag = false;
          }
        });
        if (!flag) {
          Swal.fire('Crear Gestión', 'La cantidad del campo desde no es valido.', 'error');
          this.formGestion.controls.desde.setValue(this.gestion.desde);
          return;
        }
      }
    }
  }

  validarHasta() {
    const hasta = Number(this.formGestion.controls.hasta.value);
    const desde = Number(this.formGestion.controls.desde.value);
    if (this.create) {
      if (hasta <= desde) {
        Swal.fire('Crear Etapa', 'La cantidad del campo hasta no es valido.', 'error');
        this.formGestion.controls.hasta.setValue(0);
        return;
      }
      if (this.$etapas.length == 0) {
        this.desdeTemp.setValue(desde);
        this.desdeTemp.disable();
        this.hastaTemp.setValue(desde + 1);
      }
    } else {
      if (hasta <= desde) {
        Swal.fire('Crear Gestión', 'La cantidad del campo hasta no es valido.', 'error');
        this.formGestion.controls.hasta.setValue(this.gestion.hasta);
        return;
      }
    }
  }

  listarGestiones() {
    this.spinner.show();
    this.carteraService.getGestiones().subscribe(
      response => {
        if (response.exito) {
          this.gestiones = response.objeto;
        }
        this.spinner.hide();
      }
    );
  }

  selectedGestion(event: any) {
    if (event) {
      const temp = this.cartera.carteraGestions.find(c => c.codGestion == event);
      if (temp) {
        this.formGestion.controls.codGestion.setValue('');
        this.toastr.warning('Ya tiene la gestion asignada a la cartera');
        return;
      }
      const gestion = this.gestiones.find(i => i.codGestion == event);
      if (gestion) {
        this.gestion = Object.assign({}, gestion);
        this.formGestion.controls.desde.setValue(this.gestion.desde);
        this.formGestion.controls.hasta.setValue(this.gestion.hasta);
      }
    }
  }

  selectedEtapa(event: any) {
    const val = event.target.value;
    this.$etapa = null;
    if (val) {
      const etapa = this.gestion.etapas.find(i => i.codEtapa == val);
      this.$etapa = etapa;
      if (this.$etapas.length == 0) {
        this.formGestion.controls.desdeTemp.setValue(etapa.desde);
        this.formGestion.controls.hastaTemp.setValue(etapa.hasta);
        this.desdeTemp.disable();
      } else {
        const ultimo = this.$etapas[this.$etapas.length - 1];
        this.formGestion.controls.desdeTemp.setValue(Number(ultimo.hasta) + 1);
        this.formGestion.controls.hastaTemp.setValue(etapa.hasta);
        this.desdeTemp.disable();
      }
    }
  }

  addEtapa() {
    if (isNullOrUndefined(this.formGestion.controls.desdeTemp.value) || isNullOrUndefined(this.formGestion.controls.hastaTemp.value)) {
      this.toastr.warning('Debe ingresar el intervalo de días de la subetapa.');
      return;
    }

    if (!this.codEtapaTemp.value || this.codEtapaTemp.value && this.codEtapaTemp.value.length == 0) {
      this.toastr.warning('Debe ingresar un nombre de la subetapa.');
      return;
    }

    const ultimo = Number(this.hasta.value);
    const ultimoTemp = Number(this.desdeTemp.value);
    if (ultimoTemp > ultimo) {
      Swal.fire('', 'La cantidad no es valida.', 'warning');
      this.hastaTemp.setValue(ultimo);
      return;
    }

    if (this.$etapas.length > 0) {
      const last = this.$etapas[this.$etapas.length - 1];
      if (Number(last.hasta) == ultimoTemp) {
        Swal.fire('', 'No hay días disponibles', 'warning');
        this.hastaTemp.setValue(ultimo);
        this.hastaTemp.disable();
        return;
      }
    }

    this.formGestion.controls.codGestion.disable();
    this.formGestion.controls.desde.disable();
    this.formGestion.controls.hasta.disable();
    const index = this.$etapas.findIndex(i => i.codEtapa == this.formGestion.controls.codEtapaTemp.value);
    if (index >= 0) {
      this.$etapas[index].desde = this.formGestion.controls.desdeTemp.value;
      this.$etapas[index].hasta = this.formGestion.controls.hastaTemp.value;
    } else {
      const item = this.gestion.etapas.find(i => i.codEtapa == this.formGestion.controls.codEtapaTemp.value);
      const etapa = Object.assign({}, item);
      if (etapa) {
        etapa.desde = this.formGestion.controls.desdeTemp.value;
        etapa.hasta = this.formGestion.controls.hastaTemp.value;
        this.$etapas.push(etapa);
      }
    }
    this.$etapas = this.$etapas.sort((a, b) => (a.codEtapa > b.codEtapa) ? 1 : ((b.codEtapa > a.codEtapa) ? -1 : 0));
    this.formGestion.controls.codEtapaTemp.setValue(null);
    this.desdeTemp.setValue('');
    this.desdeTemp.enable();
    this.formGestion.controls.hastaTemp.setValue('');
    this.disbleCampoHasta();
    this.calcularValoresTemp();
  }

  removeEtapa(codEtapa: any, index) {
    if (this.create) {
      const lastIndex = this.$etapas.length - 1;
      if (index == lastIndex) {
        this.$etapas.splice(index, 1);
        this.hastaTemp.enable();
        this.disbleCampoHasta();
        this.calcularValoresTemp();
      } else {
        Swal.fire('', 'Debe eliminar el ultimo de la lista.', 'warning');
      }
    } else {
      this.$etapas = this.$etapas.filter(i => i.codEtapa != codEtapa);
      if (this.$etapas.length == 0) {
        this.formGestion.controls.desde.enable();
        this.formGestion.controls.hasta.enable();
      }
    }
  }

  agregar() {
    if (this.formGestion.invalid) {
      this.toastr.warning('Debe ingresar los datos obligatorios.');
      return;
    }
    if (this.$etapas.length == 0) {
      this.toastr.warning('Debe ingresar al menos una subetapa');
      return;
    }
    const etapas = this.$etapas;
    const ultima = this.$etapas[this.$etapas.length - 1];
    if (Number(ultima.hasta) < Number(this.hasta.value)) {
      Swal.fire('', `Debe ocupar todos los días disponible de la etapa [${this.desde.value} - ${this.hasta.value}], se quedo en : ${ultima.hasta}.`, 'warning');
      return;
    }
    const gestion = Object.assign({}, this.gestion);
    gestion.desde = Number(this.formGestion.controls.desde.value);
    gestion.hasta = Number(this.formGestion.controls.hasta.value);
    gestion.etapas = etapas;
    this.spinner.show();
    this.carteraService.agregarGestionCartera(gestion, this.cartera.codCartera).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('', res.mensaje, 'success');
        } else {
          Swal.fire('', res.mensaje, 'warning');
        }
        this.spinner.hide();
      },
      err => {
        this.toastr.error('Ocurrio un error en el proceso');
        this.spinner.hide();
      }
    );
  }


  get desde() {
    return this.formGestion.controls.desde;
  }

  get hasta() {
    return this.formGestion.controls.hasta;
  }

  get desdeTemp() {
    return this.formGestion.controls.desdeTemp;
  }

  get hastaTemp() {
    return this.formGestion.controls.hastaTemp;
  }

  get codEtapaTemp() {
    return this.formGestion.controls.codEtapaTemp;
  }

  disbleCampoHasta() {
    if (this.$etapas.length > 0) {
      this.hasta.disable();
    } else {
      this.hasta.enable();
    }
  }

  validarHastaTemp() {
    const hasta = Number(this.hastaTemp.value);
    const desde = Number(this.desdeTemp.value);
    if (hasta > this.hasta.value) {
      Swal.fire('', 'La cantidad no debe superar a ' + this.hasta.value, 'warning');
      this.hastaTemp.setValue(this.$etapa.hasta);
      return;
    }

    if (hasta <= desde) {
      Swal.fire('Crear sub-Etapa', 'La cantidad del campo hasta no es valido.', 'error');
      this.hastaTemp.setValue(this.$etapa.hasta);
      return;
    }
  }

  calcularValoresTemp() {
    if (this.$etapas.length == 0) {
      this.desdeTemp.setValue(Number(this.desde.value));
      this.hastaTemp.setValue(Number(this.desde.value) + 1);
      this.desdeTemp.disable();
    } else {
      const ultimo = this.$etapas[this.$etapas.length - 1];
      const desde = Number(ultimo.hasta) + 1;
      if (desde <= Number(this.hasta.value)) {
        this.desdeTemp.setValue(desde);
        this.desdeTemp.disable();
      } else {
        this.desdeTemp.setValue(Number(this.hasta.value));
        this.hastaTemp.setValue(Number(this.hasta.value));
        this.desdeTemp.disable();
        this.hastaTemp.disable();
      }
    }
  }

  isDisable() {
    return !!isNullOrUndefined(this.codEtapaTemp.value);

  }
}
