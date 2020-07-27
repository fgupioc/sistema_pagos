export class TipoNotificacion {

  constructor(
    public nombre: string,
    public limiteCaracteres: number,
    public codTipoNotificacion?: number,
    public fechaCreacion?: string,
    public fechaActualizacion?: string,
    public userCreate?: number,
    public userUpdate?: number,
    public estado?: string,
  ) {
  }

}
