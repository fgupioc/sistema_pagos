import { GestorGestiones } from "./gestor-gestiones";

export interface GestorCartera {
    cartera: string;
    gestiones: GestorGestiones[];
  }