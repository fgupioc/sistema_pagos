import {Injectable, NgZone} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {MapsAPILoader} from '@agm/core';

export class CurrentLocation {
  ipAddress: any;
  latitude: number;
  longitude: number;
  address: string;
  result: any;
}

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  apiUrl: string;
  info: CurrentLocation;
  private geoCoder;

  constructor(
    private http: HttpClient,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    this.info = new CurrentLocation();
    this.getIpAddress();
    this.apiUrl = `${environment.serverUrl}ubigeo/`;
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
    });
  }

  listarDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarDepartamentos`);
  }

  listarProvincias(codDepartamento: any): Observable<any[]> {
    const options = {params: new HttpParams().set('codDepartamento', codDepartamento)};
    return this.http.get<any[]>(`${this.apiUrl}listarProvincias`, options);
  }

  listarDistritos(codDepartamento: string, codProvincia: string): Observable<any[]> {
    const options = {params: new HttpParams().set('codDepartamento', codDepartamento).set('codProvincia', codProvincia)};
    return this.http.get<any[]>(`${this.apiUrl}listarDistritos`, options);
  }

  getIpAddress() {
    this.http.get<{ ip: string }>('https://jsonip.com').subscribe(({ip}) => this.info.ipAddress = ip);
  }


  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.info.latitude = position.coords.latitude;
        this.info.longitude = position.coords.longitude;
        this.getAddress(this.info.latitude, this.info.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    if (this.geoCoder) {
      this.geoCoder.geocode({location: {lat: latitude, lng: longitude}}, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.info.address = results[0].formatted_address;
            this.info.result = results[0];
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    }
  }

  get infoCurrentLocation() {
    return this.info;
  }
}
