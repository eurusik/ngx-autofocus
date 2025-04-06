import type {ElementRef, NgZone, Renderer2} from '@angular/core';
import {AbstractNgxAutofocusHandler} from './abstract.handler';
import {NgxAutofocusOptions} from '../autofocus.options';
import {isPresent} from '../utils/is-present';
import {px} from '../utils/px';

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
  private timeoutIds: number[] = [];
  private fakeInput: HTMLInputElement | null = null;
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

  private cleanup(): void {
    this.clearAllTimeouts();
    this.removeFakeInput();
  }
  
  private clearAllTimeouts(): void {
    this.timeoutIds.forEach(id => {
      if (id) {
        this.win.clearTimeout(id);
      }
    });
    this.timeoutIds = [];
  }
  
  private removeFakeInput(): void {
    if (this.fakeInput) {
      this.fakeInput.remove();
      this.fakeInput = null;
    }
  }

  private iosWebkitAutofocus(): void {
    this.cleanup();

    const fakeInput = this.createAndSetupFakeInput();
    const duration = this.getDurationTimeBeforeFocus();
    
    const handlers = this.setupEventHandlers(fakeInput, duration);
    this.addEventListeners(fakeInput, handlers);
    this.appendFakeInputToParent(fakeInput);
    this.focusAndClickFakeInput(fakeInput);
  }
  
  private createAndSetupFakeInput(): HTMLInputElement {
    const fakeInput = this.makeFakeInput();
    this.fakeInput = fakeInput;
    return fakeInput;
  }
  
  private setupEventHandlers(fakeInput: HTMLInputElement, duration: number): {
    blurHandler: () => void;
    focusHandler: () => void;
    touchEndHandler: () => void;
    orientationChangeHandler: () => void;
  } {
    let fakeFocusTimeoutId = 0;
    let elementFocusTimeoutId = 0;
    
    const orientationChangeHandler = (): void => {
      this.updateFakeInputPosition(fakeInput);
    };

    const blurHandler = (): void => {
      fakeInput.focus({preventScroll: true});
    };

    const focusHandler = (): void => {
      if (fakeFocusTimeoutId) {
        this.win.clearTimeout(fakeFocusTimeoutId);
      }

      fakeFocusTimeoutId = this.win.setTimeout(() => {
        this.handleFakeFocusTimeout(fakeInput, elementFocusTimeoutId, duration, {
          blurHandler,
          focusHandler,
          touchEndHandler,
          orientationChangeHandler
        });
      });
      
      this.timeoutIds.push(fakeFocusTimeoutId);
    };
    
    const touchEndHandler = (): void => {
      fakeInput.focus({preventScroll: true});
    };
    
    return {
      blurHandler,
      focusHandler,
      touchEndHandler,
      orientationChangeHandler
    };
  }
  
  private updateFakeInputPosition(fakeInput: HTMLInputElement): void {
    const rect = this.element.getBoundingClientRect();
    fakeInput.style.top = px(rect.top);
    fakeInput.style.left = px(rect.left);
    fakeInput.style.height = px(rect.height);
    fakeInput.style.width = px(rect.width / 2);
  }
  
  private handleFakeFocusTimeout(
    fakeInput: HTMLInputElement, 
    elementFocusTimeoutId: number, 
    duration: number,
    handlers: {
      blurHandler: () => void;
      focusHandler: () => void;
      touchEndHandler: () => void;
      orientationChangeHandler: () => void;
    }
  ): void {
    if (elementFocusTimeoutId) {
      this.win.clearTimeout(elementFocusTimeoutId);
    }

    this.removeEventListeners(fakeInput, handlers);

    elementFocusTimeoutId = this.win.setTimeout(() => {
      this.focusRealElementAndHandleKeyboard(fakeInput);
    }, duration);
    
    this.timeoutIds.push(elementFocusTimeoutId);
  }
  
  /**
   * Focus on real element and handle keyboard appearance
   */
  private focusRealElementAndHandleKeyboard(fakeInput: HTMLInputElement): void {
    this.element.focus({preventScroll: this.options.preventScroll});
    
    const keyboardAppearanceTimeout = this.win.setTimeout(() => {
      if (!this.options.preventScroll) {
        this.scrollIntoViewIfNeeded();
      }
      
      if (fakeInput.parentNode) {
        fakeInput.remove();
      }
      this.fakeInput = null;
    }, 300); // Wait for keyboard to appear
    
    this.timeoutIds.push(keyboardAppearanceTimeout);
  }
  
  private addEventListeners(
    fakeInput: HTMLInputElement, 
    handlers: {
      blurHandler: () => void;
      focusHandler: () => void;
      touchEndHandler: () => void;
      orientationChangeHandler: () => void;
    }
  ): void {
    fakeInput.addEventListener('blur', handlers.blurHandler, {once: true});
    fakeInput.addEventListener('focus', handlers.focusHandler);
    fakeInput.addEventListener('touchend', handlers.touchEndHandler, {once: true});
    this.win.addEventListener('orientationchange', handlers.orientationChangeHandler);
    this.win.addEventListener('resize', handlers.orientationChangeHandler);
  }
  
  private removeEventListeners(
    fakeInput: HTMLInputElement, 
    handlers: {
      blurHandler: () => void;
      focusHandler: () => void;
      touchEndHandler: () => void;
      orientationChangeHandler: () => void;
    }
  ): void {
    fakeInput.removeEventListener('blur', handlers.blurHandler);
    fakeInput.removeEventListener('focus', handlers.focusHandler);
    fakeInput.removeEventListener('touchend', handlers.touchEndHandler);
    this.win.removeEventListener('orientationchange', handlers.orientationChangeHandler);
    this.win.removeEventListener('resize', handlers.orientationChangeHandler);
  }
  
  private appendFakeInputToParent(fakeInput: HTMLInputElement): void {
    if (this.insideDialog()) {
      this.win.document.body.appendChild(fakeInput);
    } else {
      const parent = this.element.parentElement;
      if (parent) {
        parent.appendChild(fakeInput);
      } else {
        this.win.document.body.appendChild(fakeInput);
      }
    }
  }
  
  private focusAndClickFakeInput(fakeInput: HTMLInputElement): void {
    fakeInput.focus({preventScroll: true});
    fakeInput.click();
  }

  private makeFakeInput(): HTMLInputElement {
    const fakeInput: HTMLInputElement = this.renderer.createElement('input');
    const rect: DOMRect = this.element.getBoundingClientRect();
    const zoomLevel = this.getZoomLevel();

    this.patchFakeInputFromFocusableElement(fakeInput);
    this.setAccessibilityAttributes(fakeInput);
    this.matchInputType(fakeInput);
    
    this.applyFakeInputStyles(fakeInput, rect, zoomLevel);
    
    if (this.isIOS15OrHigher()) {
      fakeInput.style.transform = 'translateZ(0)';
    }
    
    return fakeInput;
  }
  
  private setAccessibilityAttributes(fakeInput: HTMLInputElement): void {
    fakeInput.setAttribute('aria-hidden', 'true');
    fakeInput.setAttribute('tabindex', '-1');
    fakeInput.setAttribute('role', 'presentation');
    fakeInput.setAttribute('autocorrect', 'off');
    fakeInput.setAttribute('autocapitalize', 'none');
  }
  
  private matchInputType(fakeInput: HTMLInputElement): void {
    if (this.element.tagName.toLowerCase() === 'input') {
      const inputType = (this.element as HTMLInputElement).type || 'text';
      fakeInput.type = inputType;
    }
  }
  
  private applyFakeInputStyles(fakeInput: HTMLInputElement, rect: DOMRect, zoomLevel: number): void {
    const adjustedTop = rect.top / zoomLevel;
    const adjustedLeft = rect.left / zoomLevel;
    
    fakeInput.readOnly = false;
    fakeInput.style.height = px(rect.height);
    fakeInput.style.width = px(rect.width / 2);
    fakeInput.style.position = 'fixed';
    fakeInput.style.zIndex = '-99999999';
    fakeInput.style.caretColor = 'transparent';
    fakeInput.style.border = 'none';
    fakeInput.style.outline = 'none';
    fakeInput.style.color = 'transparent';
    fakeInput.style.background = 'transparent';
    fakeInput.style.cursor = 'none';
    fakeInput.style.fontSize = px(16);
    fakeInput.style.top = px(adjustedTop);
    fakeInput.style.left = px(adjustedLeft);
    fakeInput.style.opacity = '0.01'; 
    fakeInput.style.pointerEvents = 'none';
  }

  private getDurationTimeBeforeFocus(): number {
    const durationFromCss = this.getDurationFromCssVariable();
    if (durationFromCss !== null) {
      return durationFromCss;
    }
    
    if (this.options.focusDelay !== undefined) {
      return this.options.focusDelay;
    }
    
    return 0;
  }
  
  private getDurationFromCssVariable(): number | null {
    const cssValue = this.win
      .getComputedStyle(this.element)
      .getPropertyValue('--ngx-autofocus-duration');
    
    if (cssValue) {
      const parsedValue = parseFloat(cssValue);
      if (!isNaN(parsedValue)) {
        return parsedValue;
      }
    }
    
    return null;
  }
  
  private getZoomLevel(): number {
    return this.win.outerWidth / this.win.document.documentElement.clientWidth || 1;
  }
  

  private isIOS15OrHigher(): boolean {
    const userAgent = this.win.navigator.userAgent;
    const match = userAgent.match(/OS (\d+)_/);
    
    return !!(match && match[1] && parseInt(match[1], 10) >= 15);
  }

  private insideDialog(): boolean {
    return !!this.element.closest('dialog, [role="dialog"], .dialog, .modal, [aria-modal="true"]');
  }
  

  private scrollIntoViewIfNeeded(): void {
    // Знайти всі батьківські елементи з прокруткою
    const scrollableParents = this.findScrollableParents();
    
    if (scrollableParents.length > 0) {
      this.scrollElementInParents(scrollableParents);
    } else {
      this.element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  private findScrollableParents(): HTMLElement[] {
    let parent = this.element.parentElement;
    const scrollableParents: HTMLElement[] = [];
    
    while (parent) {
      const style = this.win.getComputedStyle(parent);
      const overflow = style.getPropertyValue('overflow-y') || style.getPropertyValue('overflow');
      
      if (overflow === 'auto' || overflow === 'scroll') {
        scrollableParents.push(parent);
      }
      parent = parent.parentElement;
    }
    
    return scrollableParents;
  }
  
  private scrollElementInParents(scrollableParents: HTMLElement[]): void {
    const rect = this.element.getBoundingClientRect();
    
    scrollableParents.forEach(scrollParent => {
      const parentRect = scrollParent.getBoundingClientRect();
      
      if (rect.top < parentRect.top || rect.bottom > parentRect.bottom) {
        const centerPosition = rect.top + (rect.height / 2) - (parentRect.height / 2);
        scrollParent.scrollTop += centerPosition - parentRect.top;
      }
    });
  }

  private patchFakeInputFromFocusableElement(fakeInput: HTMLInputElement): void {
    this.copyStandardAttributes(fakeInput);
    this.handleSpecialInputTypes(fakeInput);
    this.handleContentEditableElements(fakeInput);
  }
  
  private copyStandardAttributes(fakeInput: HTMLInputElement): void {
    TEXTFIELD_ATTRS.forEach((attr) => {
      const value = this.element.getAttribute(attr);

      if (isPresent(value)) {
        fakeInput.setAttribute(attr, value);
      }
    });
  }
  
  private handleSpecialInputTypes(fakeInput: HTMLInputElement): void {
    if (this.element.tagName.toLowerCase() !== 'input') {
      return;
    }
    
    const inputElement = this.element as HTMLInputElement;
    
    if (inputElement.inputMode) {
      fakeInput.inputMode = inputElement.inputMode;
    }
    
    if (this.isNumericInput(inputElement)) {
      fakeInput.inputMode = 'numeric';
      fakeInput.pattern = '[0-9]*';
    }
    
    if (inputElement.type === 'tel') {
      fakeInput.inputMode = 'tel';
    }
    
    if (inputElement.type === 'email') {
      fakeInput.inputMode = 'email';
    }
    
    if (inputElement.type === 'url') {
      fakeInput.inputMode = 'url';
    }
  }
  
  private isNumericInput(inputElement: HTMLInputElement): boolean {
    return (
      inputElement.type === 'number' || 
      inputElement.inputMode === 'numeric' || 
      inputElement.inputMode === 'decimal'
    );
  }
  
  private handleContentEditableElements(fakeInput: HTMLInputElement): void {
    if (this.element.getAttribute('contenteditable') === 'true') {
      fakeInput.setAttribute('contenteditable', 'true');
    }
  }
}
