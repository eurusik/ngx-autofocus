import {ElementRef, NgZone, Renderer2} from '@angular/core';

import type {NgxAutofocusOptions} from '../autofocus.options';
import {AbstractNgxAutofocusHandler} from './abstract.handler';

/**
 * List of attributes to copy from the original input to the fake input
 * to help iOS detect what keyboard to show
 */
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

/**
 * iOS-specific implementation of autofocus handler
 * Uses a special technique to handle iOS focus issues
 */
export class NgxIosAutofocusHandler extends AbstractNgxAutofocusHandler {
    constructor(
        protected override readonly el: ElementRef<HTMLElement>,
        private readonly renderer: Renderer2,
        private readonly ngZone: NgZone,
        private readonly window: Window,
        protected override readonly options: NgxAutofocusOptions,
    ) {
        super(el, options);
    }

    /**
     * Set focus to the target element
     * Uses special iOS-specific handling for text fields
     */
    public setFocus(): void {
        if (this.isTextFieldElement) {
            this.ngZone.runOutsideAngular(() => this.iosWebkitAutofocus());
        } else {
            this.element.focus({preventScroll: true});
        }
    }

    /**
     * Special iOS focus handling using a fake input technique
     * This works around various iOS focus and keyboard issues
     */
    private iosWebkitAutofocus(): void {
        const fakeInput: HTMLInputElement = this.createFakeInput();
        const duration = this.getAnimationDuration();
        let fakeFocusTimeoutId = 0;
        let elementFocusTimeoutId = 0;

        const blurHandler = (): void => fakeInput.focus({preventScroll: true});
        
        const focusHandler = (): void => {
            clearTimeout(fakeFocusTimeoutId);

            fakeFocusTimeoutId = this.window.setTimeout(() => {
                clearTimeout(elementFocusTimeoutId);

                fakeInput.removeEventListener('blur', blurHandler);
                fakeInput.removeEventListener('focus', focusHandler);

                elementFocusTimeoutId = this.window.setTimeout(() => {
                    this.element.focus({preventScroll: this.options.preventScroll});
                    fakeInput.remove();
                }, duration);
            });
        };

        fakeInput.addEventListener('blur', blurHandler, {once: true});
        fakeInput.addEventListener('focus', focusHandler);

        if (this.isInsideDialog()) {
            this.window.document.body.appendChild(fakeInput);
        } else {
            this.element.parentElement?.appendChild(fakeInput);
        }

        // Focus the fake input
        fakeInput.focus({preventScroll: true});
    }

    /**
     * Create a fake input element that mimics the real input
     * This is necessary to properly handle iOS keyboard behavior
     */
    private createFakeInput(): HTMLInputElement {
        const fakeInput: HTMLInputElement = this.renderer.createElement('input');
        const rect: DOMRect = this.element.getBoundingClientRect();

        this.copyAttributesToFakeInput(fakeInput);

        fakeInput.style.height = `${rect.height}px`;
        fakeInput.style.width = `${rect.width / 2}px`;
        fakeInput.style.position = 'fixed';
        fakeInput.style.zIndex = '-99999999';
        fakeInput.style.caretColor = 'transparent';
        fakeInput.style.border = 'none';
        fakeInput.style.outline = 'none';
        fakeInput.style.color = 'transparent';
        fakeInput.style.background = 'transparent';
        fakeInput.style.cursor = 'none';
        fakeInput.style.fontSize = '16px';
        fakeInput.style.top = `${rect.top}px`;
        fakeInput.style.left = `${rect.left}px`;

        return fakeInput;
    }

    /**
     * Get the animation duration from CSS variables or default to 0
     */
    private getAnimationDuration(): number {
        return (
            parseFloat(
                this.window
                    .getComputedStyle(this.element)
                    .getPropertyValue('--ngx-duration'),
            ) || 0
        );
    }

    /**
     * Check if the element is inside a dialog
     * This is important because iOS has issues with focus in dialogs
     */
    private isInsideDialog(): boolean {
        return !!this.element.closest('dialog') || 
               !!this.element.closest('[role="dialog"]');
    }

    /**
     * Copy relevant attributes from the original element to the fake input
     * This helps iOS detect what keyboard to show
     */
    private copyAttributesToFakeInput(fakeInput: HTMLInputElement): void {
        TEXTFIELD_ATTRS.forEach((attr) => {
            const value = this.element.getAttribute(attr);

            if (value !== null) {
                fakeInput.setAttribute(attr, value);
            }
        });
    }
}
