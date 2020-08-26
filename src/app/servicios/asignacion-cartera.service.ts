import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Respuesta} from '../interfaces/Respuesta';
import {HttpClient} from '@angular/common/http';
import {TreeviewItem} from 'ngx-treeview';
import {Cartera} from '../interfaces/cartera';

const urlBase = environment.serverUrl + 'asignacio-cartera';

export interface ITreeViewItem {
  text: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  children?: ITreeViewItem[];
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionCarteraService {

  constructor(
    private http: HttpClient
  ) {
  }

  getCartera(nombre: string): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/${nombre}/cartera`);
  }

  listarEjecutivos(): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/ejecutivos`);
  }

  buscarEjecutivoByCodUsuario(codUsuario: any): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/${codUsuario}/ejecutivo`);
  }

  convertToTreeviewItem(cartera: Cartera): TreeviewItem[] {
    const gestiones: ITreeViewItem[] = [];

    cartera.gestiones.forEach(gestion => {
      const etapas: ITreeViewItem[] = [];
      gestion.etapas.forEach(etapa => {
        etapas.push({
          text: etapa.nombre,
          value: String(etapa.codEtapa),
          checked: false,
        });
      });

      gestiones.push({
        text: gestion.nombre,
        value: String(gestion.codGestion),
        children: etapas,
      });
    });
    const root: ITreeViewItem = {
      text: cartera.nombre,
      value: String(cartera.codCartera),
      children: gestiones,
    };

    const itCategory = new TreeviewItem(root);
    return [itCategory];
  }

  listarCamposByCartera(codCartera: any): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/${codCartera}/campos`);
  }

  convertCamposToTreeviewItem(items: any[], codCartera: number): TreeviewItem[] {
    const childrens: ITreeViewItem[] = [];
    let campoName: string;
    let codCampo: string;

    items.forEach(i => {
      codCampo = i.codCampo;
      if (i.codCampo != '003') {
        childrens.push({
          text: i.descripcion,
          value: i.codGrupCampo,
          checked: false
        });
        campoName = i.codCampo == '001' ? 'Tipo Crédito' : 'Sede';
      } else {
        campoName = 'Monto';
        const hasta = i.hasta ? ' a ' + i.hasta : '';
        childrens.push({
          text: i.desde + hasta,
          value:  i.codGrupCampo,
          checked: false
        });
      }
    });

    const campos: ITreeViewItem[] = [{
      text: campoName,
      value: codCampo,
      children: childrens
    }];

    const root: ITreeViewItem = {
      text: 'Campos Agrupados',
      value: String(codCartera),
      children: campos,
    };

    const itCategory = new TreeviewItem(root);
    return [itCategory];
  }

  listarCreditosByCarteraAndEjecutivo(codCartera: any, codUsuario: any): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/cartera/${codCartera}/ejecutivo/${codUsuario}`);
  }
}
