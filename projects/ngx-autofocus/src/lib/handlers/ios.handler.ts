import { ElementRef, NgZone, Renderer2 } from '@angular/core';
import { NgxAutofocusOptions } from '../autofocus.options';
import { AbstractNgxAutofocusHandler } from './abstract.handler';

const TEXTFIELD_ATTRS = [
  'type',
  'inputMode',
  'autocomplete',
  'accept',
  'min',
  'max',
  'step',
  'pattern',
  'size',
  'maxlength',
] as const;

export class NgxIosAutofocusHandler extends AbstractNgxAutofocusHandler {
  constructor(
    protected override readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly zone: NgZone,
    private readonly win: Window,
    options: NgxAutofocusOptions
  ) {
    super(el, options);
  }

  protected override get element(): HTMLElement {
    const el = this.el.nativeElement.tagName.includes('-')
      ? this.el.nativeElement.querySelector<HTMLElement>(this.options.query)
      : this.el.nativeElement;

    return el || this.el.nativeElement;
  }

  protected override get isTextFieldElement(): boolean {
    const tagName = this.element.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || this.element.isContentEditable;
  }

  public setFocus(): void {
    if (this.isTextFieldElement) {
      this.zone.runOutsideAngular(() => this.iosWebkitAutofocus());
    } else {
      this.element.focus({preventScroll: this.options.preventScroll});
    }
  }

  private iosWebkitAutofocus(): void {
    const tempInput = this.createTemporaryInput();
    const duration = 180;
    let fakeFocusTimeoutId = 0;
    let elementFocusTimeoutId = 0;

    const blurHandler = (): void => tempInput.focus({preventScroll: true});

    const focusHandler = (): void => {
      clearTimeout(fakeFocusTimeoutId);

      fakeFocusTimeoutId = window.setTimeout(() => {
        clearTimeout(elementFocusTimeoutId);

        tempInput.removeEventListener('blur', blurHandler);
        tempInput.removeEventListener('focus', focusHandler);

        elementFocusTimeoutId = window.setTimeout(() => {
          this.focusTargetElement();
          this.removeTemporaryInput(tempInput);

          if (!this.options.preventScroll) {
            this.scrollIntoViewIfNeeded();
          }
        }, duration);
      });
    };

    tempInput.addEventListener('blur', blurHandler, {once: true});
    tempInput.addEventListener('focus', focusHandler);

    const parent = this.element.parentElement || this.win.document.body;
    this.renderer.appendChild(parent, tempInput);

    tempInput.focus({preventScroll: true});

    try {
      const touchEvent = new TouchEvent('touchstart', {'bubbles': true});
      tempInput.dispatchEvent(touchEvent);
    } catch (e) {
      console.warn('TouchEvent not supported:', e);
    }
  }

  private createTemporaryInput(): HTMLInputElement {
    const tempInput = this.renderer.createElement('input');
    const rect = this.element.getBoundingClientRect();

    this.copyAttributesFromElement(tempInput);

    tempInput.style.position = 'fixed';
    tempInput.style.zIndex = '-99999';
    tempInput.style.opacity = '0';
    tempInput.style.height = '1px';
    tempInput.style.width = '1px';
    tempInput.style.pointerEvents = 'none';
    tempInput.style.fontSize = '16px';
    tempInput.style.caretColor = 'transparent';
    tempInput.style.border = 'none';
    tempInput.style.outline = 'none';
    tempInput.style.color = 'transparent';
    tempInput.style.background = 'transparent';
    tempInput.style.cursor = 'none';

    tempInput.style.top = `${rect.top}px`;
    tempInput.style.left = `${rect.left}px`;

    return tempInput;
  }

  private copyAttributesFromElement(tempInput: HTMLInputElement): void {
    TEXTFIELD_ATTRS.forEach(attr => {
      const value = this.element.getAttribute(attr);

      if (value !== null) {
        tempInput.setAttribute(attr, value);
      }
    });
  }

  private focusTargetElement(): void {
    this.element.focus({preventScroll: this.options.preventScroll});

    if (this.element instanceof HTMLInputElement || this.element instanceof HTMLTextAreaElement) {
      const inputElement = this.element as HTMLInputElement | HTMLTextAreaElement;

      if (typeof inputElement.setSelectionRange === 'function') {
        const length = inputElement.value.length;
        inputElement.setSelectionRange(length, length);
      }
    }
  }

  private removeTemporaryInput(tempInput: HTMLInputElement): void {
    if (tempInput && tempInput.parentNode) {
      this.renderer.removeChild(tempInput.parentNode, tempInput);
    }
  }

  private scrollIntoViewIfNeeded(): void {
    if ('scrollIntoView' in this.element) {
      this.element.scrollIntoView({block: 'nearest'});
    }
  }
}
