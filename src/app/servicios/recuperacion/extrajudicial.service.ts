import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../../interfaces/recuperacion/solicitud';

const urlBase = environment.serverUrl + 'extrajudicial';
const urlMaestro = `${environment.serverUrl}maestro/`;

@Injectable({
  providedIn: 'root'
})

export class ExtrajudicialService {
  constructor(
    private http: HttpClient
  ) {
  }

  getCarteras(): Observable<any> {
    return this.http.get<any>(`${urlBase}/listar-carteras`);
  }

  getEjecutivos(): Observable<any> {
    return this.http.get<any>(`${urlBase}/ejecutivos`);
  }

  registrarSolicitud(solicitud: Solicitud): Observable<any> {
    return this.http.post<any>(`${urlBase}/registrar-solicitud`, solicitud);
  }

  listarsolicitudes(etapa: any, tipoBusqueda: any, numeroSolicitud: any, gestor: any, condicion: any, inicio: any, fin: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/listar-solicitudes`, {
      params: new HttpParams()
        .set('etapa', etapa)
        .set('tipoBusqueda', tipoBusqueda)
        .set('numeroSolicitud', numeroSolicitud)
        .set('gestor', gestor)
        .set('condicion', condicion)
        .set('inicio', inicio)
        .set('fin', fin)
    });
  }

  buscarDetalleSolicitud(uuid: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/detalle-solicitud`, {params: new HttpParams().set('uuid', uuid)});
  }

  buscarInformacionSocio(uuid: any, id: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/buscar-informacion-socio`, {params: new HttpParams().set('uuid', uuid).set('id', id)});
  }

  subirArchivo(archivo: File, socioId: any, fileName: any, fileExtension: any, type: any) {
    let formData = new FormData();
    formData.append('file', archivo);
    formData.append('socioId', socioId);
    formData.append('fileName', fileName);
    formData.append('fileExtension', fileExtension);
    formData.append('type', type);

    const req = new HttpRequest('POST', `${urlBase}/upload-file`, formData, {reportProgress: true});

    return this.http.request(req);
  }

  descargarArchivo(fileName: any): Observable<any> {
    return this.http.get(`${urlBase}/dowload-file/${fileName}`, {responseType: 'arraybuffer'});
  }

  aceptarSolicitudExtrajudicial(uuid: any, msj: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/aceptar-solicitud-extrajudicial`, {}, {params: new HttpParams().set('uuid', uuid).set('msj', msj)});
  }

  observarSolicitudExtrajudicial(uuid: any, msj: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/observar-solicitud-extrajudicial`, {}, {params: new HttpParams().set('uuid', uuid).set('msj', msj)});
  }

  levantarObservarSolicitudCobranza(solicitud: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/levantar-observar-solicitud-cobranza`, solicitud);
  }

  generarFormatoTransferenciaExtrajudicial(times: any, acontecimientos, comentarios, nroCredito): Observable<any> {
    return this.http.get(`${urlBase}/generar-formato-transferencia-recuperacion`, {
      responseType: 'arraybuffer',
      params: new HttpParams().set('times', times).set('acontecimiento', acontecimientos).set('comentarios', comentarios).set('codCredito', nroCredito)
    });
  }

  buscarPropiedadesPorSocio(socioId: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/buscarPropiedadesPorSocio`, {params: new HttpParams().set('socioId', socioId)});
  }

  generarExcelBusquedaPropiedadInmueblePorSocio(socioId: any): Observable<any> {
    return this.http.get(`${urlBase}/generar-excel-propiedad-inmueble-por-socio`, {
      responseType: 'arraybuffer',
      params: new HttpParams().set('socioId', socioId)
    });
  }

  generarExcelBusquedaPropiedadVehicularPorSocio(socioId: any): Observable<any> {
    return this.http.get(`${urlBase}/generar-excel-propiedad-vehicular-por-socio`, {
      responseType: 'arraybuffer',
      params: new HttpParams().set('socioId', socioId)
    });
  }

  asignarGestorExpedientes(gestorId: any, expedientes: any[]): Observable<any> {
    return this.http.post<any>(`${urlBase}/asignar-gestor-expedientes`, expedientes, {params: new HttpParams().set('gestorId', gestorId)});
  }

  guardarSolicitudTemporal(solicitud: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/guardar-solicitud-temporal`, solicitud);
  }

  obtenerSolicitudTemporalPorNroCredito(nroCredito: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/obtener-solicitudTemporal-por-credito`, {params: new HttpParams().set('nroCredito', nroCredito)});
  }

  enviarSMS(noty: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/enviar-sms`, noty);
  }

  enviarWhatsApp(noty: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/enviar-whatsapp`, noty);
  }
}
