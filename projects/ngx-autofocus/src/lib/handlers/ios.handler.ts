import type {ElementRef, NgZone, Renderer2} from '@angular/core';
import {AbstractNgxAutofocusHandler} from './abstract.handler';
import {NgxAutofocusOptions} from '../autofocus.options';

export class NgxIosAutofocusHandler extends AbstractNgxAutofocusHandler {
  constructor(
    el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly zone: NgZone,
    private readonly win: Window,
    options: NgxAutofocusOptions,
  ) {
    super(el, options);
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
    this.focusTemporaryInput(tempInput);
    
    setTimeout(() => {
      this.focusTargetElement();
      this.removeTemporaryInput(tempInput);
      
      if (!this.options.preventScroll) {
        this.scrollIntoViewIfNeeded();
      }
    }, 180);
  }
  
  private createTemporaryInput(): HTMLInputElement {
    const tempInput = this.renderer.createElement('input');
    tempInput.type = 'text';
    tempInput.style.position = 'absolute';
    tempInput.style.opacity = '0';
    tempInput.style.height = '1px';
    tempInput.style.width = '1px';
    tempInput.style.pointerEvents = 'none';
    tempInput.style.fontSize = '16px';
    
    const parent = this.element.parentElement || this.win.document.body;
    this.renderer.appendChild(parent, tempInput);
    
    return tempInput;
  }
  
  private focusTemporaryInput(tempInput: HTMLInputElement): void {
    tempInput.focus();
    
    try {
      const touchEvent = new TouchEvent('touchstart', {'bubbles': true});
      tempInput.dispatchEvent(touchEvent);
    } catch (e) {
      console.warn('TouchEvent not supported:', e);
    }
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
    if (tempInput.parentElement) {
      tempInput.parentElement.removeChild(tempInput);
    }
  }
  
  private scrollIntoViewIfNeeded(): void {
    if ('scrollIntoView' in this.element) {
      this.element.scrollIntoView({block: 'nearest'});
    }
  }
}
