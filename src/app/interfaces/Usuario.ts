export interface Usuario {
  id: number;
  alias: string;
  usuario: string;
  fechaInicioSesion: string;
  fechaFinSesion: string;
  codTipoUsuario: string;
  email?: string;
  primerNombre?: string;
  primerApellido?: string;
  codEstado?: string;
  rolNombre?: string;
  role?: string;
}
