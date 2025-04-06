# NgxAutofocus

A lightweight Angular directive for automatically focusing elements.

## Installation

```bash
npm install ngx-autofocus
```

## Usage

Import the directive in your component:

```typescript
import { NgxAutofocusDirective } from 'ngx-autofocus';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [NgxAutofocusDirective],
  template: `<input ngxAutofocus />`
})
export class MyComponent {}
```

### Basic Usage

```html
<input ngxAutofocus />
```

### Conditional Autofocus

```html
<input [ngxAutofocus]="shouldFocus" />
```

## API

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| ngxAutofocus | boolean | true | Controls whether the element should be focused |

## License

MIT
