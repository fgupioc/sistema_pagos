export class SweetInfo {
  title: string;
  funSuccess: {(): void;};
  funCancel?: {(): void;};
  showCancelButton? = true;
  confirmButtonText? = 'Si, Aceptar';
  cancelButtonText? = 'Cancelar';
  text?: string;
  icon? = 'success' | 'error' | 'warning' | 'info' | 'question';
}
