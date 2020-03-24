import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[Uppercase]',

})
export class UppercaseDirective {
  lastValue: string;

  constructor(public ref: ElementRef) {
  }

  @HostListener('input', ['$event']) onInput($event) {
    const start = $event.target.selectionStart;
    const end = $event.target.selectionEnd;
    $event.target.value = $event.target.value.toUpperCase();
    // setSelectionRange is only supported for: text, search, password, tel and url
    if ($event.target.setSelectionRange && /text|search|password|tel|url/i.test($event.target.type || '')) {
      $event.target.setSelectionRange(start, end);
    }
    $event.preventDefault();

    if (!this.lastValue || (this.lastValue && $event.target.value.length > 0 && this.lastValue !== $event.target.value)) {
      this.lastValue = this.ref.nativeElement.value = $event.target.value;
      // Propagation
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      event.target.dispatchEvent(evt);
    }
  }
}
