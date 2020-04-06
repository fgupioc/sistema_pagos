import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Config {
  serverUrl: string;
  loginUrl: string;
  signinUrl: string;
  clientId: string;
  clientSecret: string;
}

export function configServiceInitializerFactory(config: ConfigService): Function {
  return () => config.load();
}

@Injectable()
export class ConfigService {

  config: Config;

  constructor(private http: HttpClient) {}

  load(): Promise<any> {
    this.config = {
      serverUrl: environment.serverUrl,
      loginUrl: environment.loginUrl,
      signinUrl: environment.signinUrl,
      clientId: environment.clientId,
      clientSecret: environment.clientSecret
    };
    return of().toPromise();
  }

}
