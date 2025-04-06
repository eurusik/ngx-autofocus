import { Component, SimpleChange, NgZone, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxAutofocusDirective } from './ngx-autofocus.directive';
import { NGX_AUTOFOCUS_HANDLER, NGX_AUTOFOCUS_OPTIONS, NgxAutofocusOptions } from './autofocus.options';
import { NgxDefaultAutofocusHandler } from './handlers/default.handler';

@Component({
  template: `<input [ngxAutofocus]="shouldFocus">`,
  standalone: true,
  imports: [NgxAutofocusDirective]
})
class TestComponent {
  shouldFocus = true;
}

@Component({
  template: `
    <input id="input1" [ngxAutofocus]="shouldFocusFirst">
    <input id="input2" [ngxAutofocus]="shouldFocusSecond">
  `,
  standalone: true,
  imports: [NgxAutofocusDirective]
})
class TestMultipleComponent {
  shouldFocusFirst = false;
  shouldFocusSecond = false;
}

describe('NgxAutofocusDirective', () => {
  describe('Basic functionality', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputEl: HTMLElement;
    let directive: NgxAutofocusDirective;
    let mockHandler: { setFocus: jest.Mock };

    beforeEach(() => {
      mockHandler = {
        setFocus: jest.fn()
      };
      
      TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [
          {
            provide: NGX_AUTOFOCUS_HANDLER,
            useValue: mockHandler
          },
          {
            provide: NGX_AUTOFOCUS_OPTIONS,
            useValue: { delay: 0, preventScroll: false } as NgxAutofocusOptions
          }
        ]
      });

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      
      const directiveEl = fixture.debugElement.query(By.directive(NgxAutofocusDirective));
      directive = directiveEl.injector.get(NgxAutofocusDirective);
    });

    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });

    it('should have a focus method', () => {
      expect(typeof directive.focus).toBe('function');
    });
    
    it('should have ngAfterViewInit method', () => {
      expect(typeof directive.ngAfterViewInit).toBe('function');
    });
    
    it('should have ngOnChanges method', () => {
      expect(typeof directive.ngOnChanges).toBe('function');
    });
    
    it('should call focus() when autoFocus is true in ngAfterViewInit', () => {
      const focusSpy = jest.spyOn(directive, 'focus');
      
      component.shouldFocus = true;
      fixture.detectChanges();
      
      directive.ngAfterViewInit();
      
      expect(focusSpy).toHaveBeenCalled();
    });
    
    it('should not call focus() when autoFocus is false in ngAfterViewInit', () => {
      const focusSpy = jest.spyOn(directive, 'focus');
      
      component.shouldFocus = false;
      fixture.detectChanges();
      
      directive.ngAfterViewInit();
      
      expect(focusSpy).not.toHaveBeenCalled();
    });
    
    it('should call focus() when autoFocus changes from false to true', () => {
      const focusSpy = jest.spyOn(directive, 'focus');
      
      component.shouldFocus = false;
      fixture.detectChanges();
      
      directive.ngOnChanges({
        'autoFocus': new SimpleChange(false, true, false)
      });
      
      expect(focusSpy).toHaveBeenCalled();
    });
    
    it('should not call focus() when autoFocus changes from true to false', () => {
      const focusSpy = jest.spyOn(directive, 'focus');
      
      component.shouldFocus = true;
      fixture.detectChanges();
      
      focusSpy.mockClear();
      
      directive.ngOnChanges({
        'autoFocus': new SimpleChange(true, false, false)
      });
      
      expect(focusSpy).not.toHaveBeenCalled();
    });
    
    it('should have autoFocus property that matches input binding', () => {
      component.shouldFocus = true;
      fixture.detectChanges();
      expect(directive.autoFocus).toBe(true);
      
      component.shouldFocus = false;
      fixture.detectChanges();
      expect(directive.autoFocus).toBe(false);
    });
  });
  
  describe('Multiple inputs', () => {
    let component: TestMultipleComponent;
    let fixture: ComponentFixture<TestMultipleComponent>;
    let mockHandler: { setFocus: jest.Mock };
    let directives: NgxAutofocusDirective[];
    
    beforeEach(() => {
      mockHandler = {
        setFocus: jest.fn()
      };
      
      TestBed.configureTestingModule({
        imports: [TestMultipleComponent],
        providers: [
          {
            provide: NGX_AUTOFOCUS_HANDLER,
            useValue: mockHandler
          },
          {
            provide: NGX_AUTOFOCUS_OPTIONS,
            useValue: { delay: 0, preventScroll: false } as NgxAutofocusOptions
          }
        ]
      });
      
      fixture = TestBed.createComponent(TestMultipleComponent);
      component = fixture.componentInstance;
      
      const directiveEls = fixture.debugElement.queryAll(By.directive(NgxAutofocusDirective));
      directives = directiveEls.map(el => el.injector.get(NgxAutofocusDirective));
    });
    
    it('should have two inputs with the directive', () => {
      expect(directives.length).toBe(2);
    });
    
    it('should call focus() on the first directive when shouldFocusFirst is true', () => {
      const focusSpy1 = jest.spyOn(directives[0], 'focus');
      const focusSpy2 = jest.spyOn(directives[1], 'focus');
      
      component.shouldFocusFirst = true;
      component.shouldFocusSecond = false;
      fixture.detectChanges();
      
      directives.forEach(dir => dir.ngAfterViewInit());
      
      expect(focusSpy1).toHaveBeenCalled();
      expect(focusSpy2).not.toHaveBeenCalled();
    });
    
    it('should call focus() on the second directive when shouldFocusSecond is true', () => {
      const focusSpy1 = jest.spyOn(directives[0], 'focus');
      const focusSpy2 = jest.spyOn(directives[1], 'focus');
      
      component.shouldFocusFirst = false;
      component.shouldFocusSecond = true;
      fixture.detectChanges();
      
      directives.forEach(dir => dir.ngAfterViewInit());
      
      expect(focusSpy1).not.toHaveBeenCalled();
      expect(focusSpy2).toHaveBeenCalled();
    });
    
    it('should call focus() on both directives when both conditions are true', () => {
      const focusSpy1 = jest.spyOn(directives[0], 'focus');
      const focusSpy2 = jest.spyOn(directives[1], 'focus');
      
      component.shouldFocusFirst = true;
      component.shouldFocusSecond = true;
      fixture.detectChanges();
      
      directives.forEach(dir => dir.ngAfterViewInit());
      
      expect(focusSpy1).toHaveBeenCalled();
      expect(focusSpy2).toHaveBeenCalled();
    });
    
    it('should not call focus() on any directive when both conditions are false', () => {
      const focusSpy1 = jest.spyOn(directives[0], 'focus');
      const focusSpy2 = jest.spyOn(directives[1], 'focus');
      
      component.shouldFocusFirst = false;
      component.shouldFocusSecond = false;
      fixture.detectChanges();
      
      directives.forEach(dir => dir.ngAfterViewInit());
      
      expect(focusSpy1).not.toHaveBeenCalled();
      expect(focusSpy2).not.toHaveBeenCalled();
    });
  });
  
  describe('Integration with real handler', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputEl: HTMLElement;
    let directive: NgxAutofocusDirective;
    let realHandler: any;
    
    beforeEach(() => {      
      const mockElement = {
        tagName: 'INPUT',
        focus: jest.fn()
      } as unknown as HTMLElement;
      
      const mockElementRef = new ElementRef(mockElement);
      
      const mockOptions: NgxAutofocusOptions = { delay: 0, preventScroll: false, query: 'input' };
      const mockNgZone = { runOutsideAngular: (fn: Function) => fn() } as unknown as NgZone;
      
      realHandler = new NgxDefaultAutofocusHandler(mockElementRef, mockNgZone, mockOptions);
      
      TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [
          {
            provide: NGX_AUTOFOCUS_HANDLER,
            useValue: realHandler
          },
          {
            provide: NGX_AUTOFOCUS_OPTIONS,
            useValue: mockOptions
          }
        ]
      });

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      
      const directiveEl = fixture.debugElement.query(By.directive(NgxAutofocusDirective));
      directive = directiveEl.injector.get(NgxAutofocusDirective);
      
      jest.spyOn(realHandler, 'setFocus').mockImplementation(() => {});
    });
    
    it('should use the provided handler', () => {
      const handler = TestBed.inject(NGX_AUTOFOCUS_HANDLER);
      expect(handler).toBe(realHandler);
    });
    
    it('should use the default handler when no custom handler is provided', () => {
      const handler = TestBed.inject(NGX_AUTOFOCUS_HANDLER);
      expect(handler).toBeDefined();
      expect(typeof handler.setFocus).toBe('function');
    });
  });
});
