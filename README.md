# 🔍 NgxAutofocus

<p align="center">
  <img src="https://img.shields.io/npm/v/ngx-autofocus.svg" alt="npm version">
  <img src="https://img.shields.io/npm/dm/ngx-autofocus.svg" alt="npm downloads">
  <img src="https://img.shields.io/github/license/yourusername/ngx-autofocus.svg" alt="license">
</p>

<p align="center">
  <b>Intelligent autofocus for Angular that works everywhere — even on iOS!</b>
</p>

## ✨ Features

- 🚀 **Simple to use** — just add the `ngxAutofocus` directive to any element
- 📱 **Works on iOS** — special iOS handler solves common focus issues
- 🎯 **Smart focusing** — supports conditional focus and dynamic content
- 🎭 **Animation aware** — automatically waits for animations to complete
- ⚡ **Synchronous mode** — optional immediate focus without delays
- 🧪 **Fully tested** — comprehensive test coverage for reliability

## 📦 Installation

```bash
npm install ngx-autofocus --save
```

or

```bash
yarn add ngx-autofocus
```

### Compatibility

This library is compatible with Angular 19.2.0 and above.

## 🚀 Quick Start

### Import the directive

```typescript
import { NgxAutofocusDirective } from 'ngx-autofocus';

@Component({
  // ...
  standalone: true,
  imports: [NgxAutofocusDirective],
})
export class YourComponent {}
```

### Basic usage

```html
<!-- Simple autofocus -->
<input ngxAutofocus>

<!-- Conditional autofocus -->
<input [ngxAutofocus]="shouldFocus">
```

## 🔧 Advanced Features

### Focus Handlers API

NgxAutofocus comes with three specialized handlers to manage different focus scenarios:

#### 1. NgxDefaultAutofocusHandler

The default handler provides smart focus with animation awareness:

- Automatically waits for Angular animations to complete
- Uses a race condition between animation detection and timeout
- Runs outside Angular zone for better performance

```typescript
import { NGX_AUTOFOCUS_HANDLER, NgxDefaultAutofocusHandler } from 'ngx-autofocus';

@Component({
  // ...
  providers: [
    {
      provide: NGX_AUTOFOCUS_HANDLER,
      useClass: NgxDefaultAutofocusHandler
    }
  ]
})
```

#### 2. NgxIosAutofocusHandler

Specialized handler for iOS devices that solves common focus issues:

- Creates a temporary invisible input to trigger the keyboard
- Copies relevant attributes from the original input
- Uses precise timing to overcome iOS focus limitations
- Properly cleans up temporary elements

This handler is automatically used when an iOS device is detected.

#### 3. NgxSynchronousAutofocusHandler

Simplified handler for immediate focus without delays:

```typescript
import { NGX_AUTOFOCUS_HANDLER, NgxSynchronousAutofocusHandler } from 'ngx-autofocus';

@Component({
  // ...
  providers: [
    {
      provide: NGX_AUTOFOCUS_HANDLER,
      useClass: NgxSynchronousAutofocusHandler
    }
  ]
})
```

### Custom Focus Options

Configure focus behavior with custom options:

```typescript
import { NGX_AUTOFOCUS_OPTIONS } from 'ngx-autofocus';

@Component({
  // ...
  providers: [
    {
      provide: NGX_AUTOFOCUS_OPTIONS,
      useValue: { 
        delay: 300,             // Delay in ms before focusing
        preventScroll: true,    // Prevent automatic scrolling
        query: 'input, button'  // Custom query for finding focusable elements
      }
    }
  ]
})
```

### Creating Custom Handlers

You can create your own focus handler by extending the `AbstractNgxAutofocusHandler` class:

```typescript
import { ElementRef } from '@angular/core';
import { AbstractNgxAutofocusHandler, NgxAutofocusOptions } from 'ngx-autofocus';

export class MyCustomHandler extends AbstractNgxAutofocusHandler {
  constructor(
    protected override readonly el: ElementRef<HTMLElement>,
    protected override readonly options: NgxAutofocusOptions
  ) {
    super(el, options);
  }

  public setFocus(): void {
    // Your custom focus implementation
    console.log('Custom focus logic');
    this.element.focus({ preventScroll: this.options.preventScroll });
  }
}
```

## 🌟 Demo

The project includes a demonstration application showcasing various NgxAutofocus scenarios:

```bash
git clone https://github.com/yourusername/ngx-autofocus.git
cd ngx-autofocus
npm install
npm start
```

Open your browser and navigate to `http://localhost:4200/`.

### iOS Demo

The demo includes a special iOS simulation mode that demonstrates how the iOS handler works:

- Shows the temporary input element creation process
- Visualizes the focus sequence
- Allows testing iOS behavior on non-iOS devices

## 🧪 Testing

The directive has comprehensive test coverage:

```bash
npm test
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please create an issue or pull request on GitHub.
