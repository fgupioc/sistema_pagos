import {Telefono} from './telefono';
import {Email} from './email';
import {Direccion} from './direccion';
import {DocumentoIdentidad} from './documento-identidad';
import {PersonaNatural} from './persona-natural';

export class Persona {
  id?: number;
  alias?: string;
  fechaNacimiento?: string;
  personaNatural?: PersonaNatural;
  personaJuridica?: string;
  telefonos?: Telefono[] = [];
  correos?: Email[] = [];
  direcciones?: Direccion[] = [];
  documentosIdentidad?: DocumentoIdentidad[] = [];
}
