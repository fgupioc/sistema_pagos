import { GestorCartera } from "./gestor-cartera";

export interface GestorMoneda {
    moneda: string;
    gestor: string;
    gestorCod: number;
    carteras: GestorCartera[];
}


