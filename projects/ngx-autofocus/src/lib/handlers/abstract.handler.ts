import type {ElementRef} from '@angular/core';

import type {NgxAutofocusHandler, NgxAutofocusOptions} from '../autofocus.options';

/**
 * Abstract base class for autofocus handlers
 */
export abstract class AbstractNgxAutofocusHandler implements NgxAutofocusHandler {
    constructor(
        protected readonly el: ElementRef<HTMLElement>,
        protected readonly options: NgxAutofocusOptions,
    ) {}

    /**
     * Set focus to the target element
     */
    public abstract setFocus(): void;

    /**
     * Get the element to focus
     */
    protected get element(): HTMLElement {
        // For custom elements, try to find focusable child elements
        const el = this.el.nativeElement.tagName.includes('-')
            ? this.el.nativeElement.querySelector<HTMLElement>(this.options.query)
            : this.el.nativeElement;

        return el || this.el.nativeElement;
    }

    /**
     * Check if the element is a text field
     */
    protected get isTextFieldElement(): boolean {
        return this.element.matches(this.options.query);
    }
}
