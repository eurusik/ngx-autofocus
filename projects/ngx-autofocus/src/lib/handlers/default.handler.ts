import {ElementRef, NgZone} from '@angular/core';
import {map, race, skipWhile, take, throttleTime, timer} from 'rxjs';

import type {NgxAutofocusOptions} from '../autofocus.options';
import {AbstractNgxAutofocusHandler} from './abstract.handler';

/**
 * Constants for animation handling
 */
const TIMEOUT = 1000;
const THROTTLE_TIME = 100;
const NG_ANIMATION_SELECTOR = '.ng-animating';

/**
 * Default implementation of autofocus handler with animation support
 */
export class NgxDefaultAutofocusHandler extends AbstractNgxAutofocusHandler {
    constructor(
        protected override readonly el: ElementRef<HTMLElement>,
        private readonly ngZone: NgZone,
        protected override readonly options: NgxAutofocusOptions,
    ) {
        super(el, options);
    }

    /**
     * Set focus to the target element
     * Handles animations and delays properly
     */
    public setFocus(): void {
        if (!this.isFocusable(this.element)) {
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            if (this.isTextFieldElement) {
                // For text fields, wait for animations to complete
                this.waitForAnimationsAndFocus();
            } else {
                // For non-text fields, focus immediately but prevent scroll
                this.element.focus({preventScroll: true});
            }
        });
    }

    /**
     * Wait for animations to complete before focusing
     */
    private waitForAnimationsAndFocus(): void {
        const delay = this.options.delay || 0;

        const delayTimer$ = timer(Number.isNaN(delay) ? 0 : delay || TIMEOUT);

        const animationCheck$ = this.createAnimationFrameCheck();

        race(delayTimer$, animationCheck$).subscribe(() => {
            this.element.focus({preventScroll: this.options.preventScroll});
        });
    }

    /**
     * Create an observable that completes when animations are done
     */
    private createAnimationFrameCheck() {
        return timer(0, 0).pipe(
            throttleTime(THROTTLE_TIME),
            map(() => this.element.closest(NG_ANIMATION_SELECTOR)),
            skipWhile(Boolean),
            take(1)
        );
    }

    /**
     * Check if an element is focusable
     */
    private isFocusable(element: HTMLElement): boolean {
        return element &&
               !element.hasAttribute('disabled') &&
               !element.hasAttribute('hidden') &&
               element.tabIndex !== -1;
    }
}
