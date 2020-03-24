import {OnInit, ElementRef, HostListener, Directive} from '@angular/core';


@Directive({
  selector: '[SoloLetras]'
})

export class SoloLetrasDirective implements OnInit {
  private el: any;

  constructor(
    private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }


  ngOnInit(): void {
    this.el.value = this.el.value.toUpperCase();
  }

  @HostListener('focus', ['$event.target.value', '$event'])
  onFocus(value, event) {
    this.el.value = value.toUpperCase();
    if (event.which == 9) {
      return false;
    }
    this.el.select();

  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.el.value = value.toUpperCase();
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
    if (
      (e.keyCode == 67 && e.ctrlKey) ||
      (e.keyCode == 86 && e.ctrlKey) ||
      (e.keyCode == 88 && e.ctrlKey) ||
      (e.keyCode == 99 && e.ctrlKey) ||
      (e.keyCode == 118 && e.ctrlKey) ||
      (e.keyCode == 120 && e.ctrlKey)
    ) {
      e.preventDefault();
    }

    if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
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
    if ((e.shiftKey || (e.keyCode < 65 || e.keyCode > 91)) && (e.keyCode < 97 || e.keyCode > 123)) {
      if (e.keyCode != 32) {
        e.preventDefault();
      }

    }
  }
}
