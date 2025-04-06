import type {BooleanInput} from '@angular/cdk/coercion';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import type {AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import {DestroyRef, Directive, inject, Input} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {timer} from 'rxjs';

import {
    NGX_AUTOFOCUS_HANDLER,
    NGX_AUTOFOCUS_OPTIONS,
    NGX_AUTOFOCUS_PROVIDERS,
} from './autofocus.options';

@Directive({
    standalone: true,
    selector: '[ngxAutofocus]',
    providers: NGX_AUTOFOCUS_PROVIDERS,
})
export class NgxAutofocusDirective implements AfterViewInit, OnChanges {
    private readonly handler = inject(NGX_AUTOFOCUS_HANDLER);
    private readonly options = inject(NGX_AUTOFOCUS_OPTIONS);
    private readonly destroyRef = inject(DestroyRef);

    @Input({
        alias: 'ngxAutofocus',
        transform: coerceBooleanProperty,
    })
    public autoFocus: BooleanInput;

    public ngAfterViewInit(): void {
        if (this.autoFocus) {
            this.focus();
        }
    }
    
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['autoFocus'] && !changes['autoFocus'].firstChange) {
            const currentValue = changes['autoFocus'].currentValue;
            if (currentValue) {
                this.focus();
            }
        }
    }

    public focus(): void {
        if (Number.isNaN(this.options.delay)) {
            void Promise.resolve().then(() => this.handler.setFocus());
        } else {
            timer(this.options.delay)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.handler.setFocus());
        }
    }
}
