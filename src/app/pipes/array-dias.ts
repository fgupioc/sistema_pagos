import {OnInit, ElementRef, HostListener, Directive} from '@angular/core';
import {MyCurrencyPipe} from './mycurrency.pipe';


@Directive({
  selector: '[ArrayDias]'
})

export class ArrayDiasDirective implements OnInit {
  private el: any;

  constructor(
    private elementRef: ElementRef,
    private formatcurrencypipe: MyCurrencyPipe) {
    this.el = this.elementRef.nativeElement;
  }


  ngOnInit(): void {
   // this.el.value = this.formatcurrencypipe.parse(this.el.value, 0);
  }
  /*
  @HostListener('focus', ['$event.target.value', '$event'])
  onFocus(value, event) {
    this.el.value = this.formatcurrencypipe.parse(value);
    if (event.which == 9) {
      return false;
    }
    this.el.select();

  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.el.value = this.formatcurrencypipe.parse(value, 0);
  }
*/
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
    if ([46, 8, 9, 27, 13, 110, 188].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
}
