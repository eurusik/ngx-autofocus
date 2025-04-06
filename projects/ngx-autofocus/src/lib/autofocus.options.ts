import {DOCUMENT} from '@angular/common';
import {ElementRef, Inject, InjectionToken, NgZone, Provider, Renderer2, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import {NgxDefaultAutofocusHandler} from './handlers/default.handler';
import {NgxIosAutofocusHandler} from './handlers/ios.handler';
import {isIOS} from './utils/platform';

/**
 * Interface for autofocus handler
 */
export interface NgxAutofocusHandler {
    /**
     * Function to focus the element
     */
    setFocus(): void;
}

/**
 * Interface for autofocus options
 */
export interface NgxAutofocusOptions {
    /**
     * Delay in milliseconds before focusing the element
     * Use NaN for synchronous focus (no delay)
     */
    readonly delay: number;

    /**
     * Additional delay for iOS focus handling (in milliseconds)
     * This is used specifically for iOS devices to handle keyboard appearance
     */
    readonly focusDelay?: number;

    /**
     * Query selector to find focusable elements inside the host element
     */
    readonly query: string;

    /**
     * Whether to prevent scrolling when focusing
     */
    readonly preventScroll: boolean;
}

/**
 * Default autofocus options
 */
export const NGX_AUTOFOCUS_DEFAULT_OPTIONS: NgxAutofocusOptions = {
    delay: NaN, // NaN = no delay/sync
    focusDelay: 0, // No additional delay for iOS focus handling
    query: 'input, textarea, select, [contenteditable]',
    preventScroll: false,
};

/**
 * Injection token for autofocus options
 */
export const NGX_AUTOFOCUS_OPTIONS = new InjectionToken<NgxAutofocusOptions>(
    'NGX_AUTOFOCUS_OPTIONS',
    {
        factory: () => NGX_AUTOFOCUS_DEFAULT_OPTIONS,
    },
);

/**
 * Injection token to check if the current platform is iOS
 */
export const NGX_IS_IOS = new InjectionToken<boolean>(
    'NGX_IS_IOS',
    {
        factory: () => false,
    },
);

/**
 * Injection token for autofocus handler
 */
export const NGX_AUTOFOCUS_HANDLER = new InjectionToken<NgxAutofocusHandler>(
    'NGX_AUTOFOCUS_HANDLER'
);

/**
 * Providers for autofocus directive
 */
export const NGX_AUTOFOCUS_PROVIDERS: Provider[] = [
    {
        provide: NGX_AUTOFOCUS_OPTIONS,
        useValue: NGX_AUTOFOCUS_DEFAULT_OPTIONS
    },
    {
        provide: NGX_IS_IOS,
        useFactory: (platformId: Object, document: Document) => {
            if (isPlatformBrowser(platformId) && document.defaultView) {
                return isIOS(document.defaultView);
            }
            return false;
        },
        deps: [PLATFORM_ID, DOCUMENT]
    },
    {
        provide: NGX_AUTOFOCUS_HANDLER,
        useFactory: (
            elementRef: ElementRef,
            ngZone: NgZone,
            renderer: Renderer2,
            document: Document,
            isIos: boolean,
            options: NgxAutofocusOptions
        ) => {
            if (isIos && document.defaultView) {
                return new NgxIosAutofocusHandler(
                    elementRef,
                    renderer,
                    ngZone,
                    document.defaultView,
                    options
                );
            }

            return new NgxDefaultAutofocusHandler(elementRef, ngZone, options);
        },
        deps: [ElementRef, NgZone, Renderer2, DOCUMENT, NGX_IS_IOS, NGX_AUTOFOCUS_OPTIONS],
    },
];
