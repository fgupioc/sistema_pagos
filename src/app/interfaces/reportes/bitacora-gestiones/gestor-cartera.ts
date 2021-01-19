import {GestorGestiones} from "./gestor-gestiones";

export interface GestorCartera {
  cartera: string;
  carteraCod: number;
  gestiones: GestorGestiones[];
}
