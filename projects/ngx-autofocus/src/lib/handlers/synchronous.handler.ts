import {ElementRef} from '@angular/core';

import type {NgxAutofocusOptions} from '../autofocus.options';
import {AbstractNgxAutofocusHandler} from './abstract.handler';

/**
 * Simple synchronous autofocus handler
 * Immediately focuses the element without any delays or special handling
 */
export class NgxSynchronousAutofocusHandler extends AbstractNgxAutofocusHandler {
    constructor(
        protected override readonly el: ElementRef<HTMLElement>,
        protected override readonly options: NgxAutofocusOptions,
    ) {
        super(el, options);
    }

    /**
     * Set focus to the target element immediately
     */
    public setFocus(): void {
        this.element.focus({preventScroll: this.options.preventScroll});
    }
}
