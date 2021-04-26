import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
})
export class UppercaseDirective {
  lastValue: string = '';

  @HostListener('input', ['$event']) onInput($event: any) {
    const start = $event.target.selectionStart;
    const end = $event.target.selectionEnd;
    $event.target.value = $event.target.value.toUpperCase();
    $event.target.setSelectionRange(start, end);
    $event.preventDefault();

    if (
      !this.lastValue ||
      (this.lastValue &&
        $event.target.value.length > 0 &&
        this.lastValue !== $event.target.value)
    ) {
      this.lastValue = this.ref.nativeElement.value = $event.target.value;

      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      $event.target.dispatchEvent(evt);
    }
  }

  constructor(private ref: ElementRef) {}
}
