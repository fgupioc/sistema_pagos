import { GestorCartera } from "./gestor-cartera";

export interface GestorMoneda {
    moneda: string;
    gestor: string;
    carteras: GestorCartera[];
}


 