import { Component, Inject, InjectionToken, NgZone, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NgxAutofocusDirective, 
  NgxDefaultAutofocusHandler,
  NgxIosAutofocusHandler
} from 'ngx-autofocus';

@Component({
  selector: 'app-ios-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxAutofocusDirective],
  template: `
    <div class="ios-demo-container">
      <div class="platform-info">
        <div>
          <p><strong>Current Platform:</strong> <span [class.highlight]="isIosDevice">{{isIosDevice ? 'iOS' : 'Non-iOS'}}</span></p>
          <p><small>The library automatically detects your platform and uses the appropriate handler</small></p>
        </div>
        <div *ngIf="!isIosDevice" class="ios-simulation">
          <button (click)="toggleIosSimulation()" class="ios-toggle-btn">
            {{simulateIos ? 'Disable' : 'Enable'}} iOS Simulation
          </button>
          <p *ngIf="simulateIos"><small>iOS behavior is now being simulated for demonstration</small></p>
        </div>
      </div>

      <div class="form-group">
        <label for="ios-input">Text input with iOS optimization:</label>
        <input 
          id="ios-input" 
          type="text" 
          ngxAutofocus 
          [(ngModel)]="iosInput" 
          placeholder="Type here..."
          #iosInputEl
        >
        <small>This input will use the iOS-specific handler on iOS devices or when simulation is enabled</small>
      </div>

      <div class="form-group">
        <label for="ios-textarea">Textarea with iOS optimization:</label>
        <textarea 
          id="ios-textarea" 
          [ngxAutofocus]="iosTextareaFocus" 
          [(ngModel)]="iosTextarea" 
          placeholder="Type here..."
          #iosTextareaEl
        ></textarea>
      </div>

      <div class="form-group checkbox-group">
        <div class="checkbox-container">
          <input type="checkbox" id="ios-focus-toggle" [(ngModel)]="iosTextareaFocus">
          <label for="ios-focus-toggle">Toggle focus on textarea</label>
        </div>
      </div>

      <div class="handler-info">
        <h3>Current Handler: <span class="highlight">{{simulateIos || isIosDevice ? 'NgxIosAutofocusHandler' : 'NgxDefaultAutofocusHandler'}}</span></h3>
        <div *ngIf="simulateIos || isIosDevice">
          <p>The iOS handler is currently active. When focusing, it will:</p>
          <ul>
            <li>Create a temporary input element to trigger the keyboard</li>
            <li>Copy relevant attributes to ensure the correct keyboard type</li>
            <li>Handle focus timing to work around iOS limitations</li>
            <li>Clean up temporary elements after focus is applied</li>
          </ul>
        </div>
        <p *ngIf="!simulateIos && !isIosDevice">
          The default handler is currently active. Enable iOS simulation to see the difference.
        </p>
      </div>

      <div class="debug-info" *ngIf="simulateIos">
        <h4>Debug Information</h4>
        <p>When the iOS handler is used, a temporary invisible input is created to help with focus.</p>
        <p>This element would be positioned at the same coordinates as the target input and styled to be invisible.</p>
        <button (click)="refocusWithDebug()" class="demo-btn">
          Refocus with Debug Visualization
        </button>
        <div *ngIf="showDebugElement" class="fake-input-debug">
          <div class="fake-input-visual"></div>
          <p>👆 This represents the temporary element created by the iOS handler</p>
          <p>It will be automatically removed after focus is applied</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ios-demo-container {
      width: 100%;
    }
    
    .platform-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f5f5f5;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border: 1px solid #eaeaea;
    }
    
    .highlight {
      color: #4285f4;
      font-weight: bold;
    }
    
    .ios-simulation {
      text-align: right;
    }
    
    .ios-toggle-btn {
      background-color: #f1f1f1;
      color: #333;
      border: 1px solid #ddd;
      padding: 8px 15px;
      font-size: 14px;
    }
    
    .ios-toggle-btn:hover {
      background-color: #e5e5e5;
    }
    
    .form-group {
      margin-bottom: 25px;
      position: relative;
      width: 100%;
      box-sizing: border-box;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 10px;
      font-weight: 500;
      color: #333;
      font-size: 16px;
    }
    
    input, textarea {
      width: 100%;
      padding: 14px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s ease;
      background-color: #fcfcfc;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
    }
    
    input:focus, textarea:focus {
      outline: none;
      border-color: #4285f4;
      box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
    }
    
    input[type="checkbox"] {
      margin-right: 8px;
      width: auto;
      outline: none;
    }
    
    input[type="checkbox"]:focus {
      outline: none;
      box-shadow: none;
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
    }
    
    .checkbox-container label {
      margin-bottom: 0;
      margin-left: 8px;
    }
    
    textarea {
      height: 100px;
      resize: vertical;
    }
    
    .handler-info {
      margin-top: 30px;
      background-color: #f0f7ff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #4285f4;
    }
    
    .handler-info h3 {
      margin-top: 0;
      color: #4285f4;
    }
    
    .handler-info ul {
      margin-top: 10px;
      padding-left: 20px;
    }
    
    .debug-info {
      margin-top: 30px;
      background-color: #fff8e1;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #ffc107;
    }
    
    .debug-info h4 {
      margin-top: 0;
      color: #ff9800;
    }
    
    .demo-btn {
      padding: 12px 20px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 15px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .fake-input-debug {
      margin-top: 20px;
      padding: 15px;
      background-color: #fffde7;
      border-radius: 8px;
      border: 1px dashed #ffc107;
      position: relative;
    }
    
    .fake-input-visual {
      height: 40px;
      width: 150px;
      border: 2px dashed #ff9800;
      border-radius: 4px;
      background-color: rgba(255, 152, 0, 0.1);
      position: relative;
    }
    
    .fake-input-visual::before {
      content: 'Temporary Input';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      color: #ff9800;
      white-space: nowrap;
    }
  `],
  providers: []
})
export class IosDemoComponent {
  iosInput = '';
  iosTextarea = '';
  iosTextareaFocus = false;
  isIosDevice = false;
  simulateIos = false;
  showDebugElement = false;
  
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2,
    private readonly ngZone: NgZone
  ) {
    this.isIosDevice = false;
  }
  
  toggleIosSimulation(): void {
    this.simulateIos = !this.simulateIos;
    
    // Update the provider value
    this.updateIosSimulation(this.simulateIos);
  }
  
  private updateIosSimulation(simulate: boolean): void {
    if (this.iosTextareaFocus) {
      setTimeout(() => {
        const textareaEl = this.document.getElementById('ios-textarea') as HTMLTextAreaElement;
        if (textareaEl) {
          textareaEl.focus();
        }
      }, 100);
    }
  }
  
  refocusWithDebug(): void {
    this.showDebugElement = true;
    
    const inputEl = this.document.getElementById('ios-input') as HTMLInputElement;
    if (!inputEl) return;
    
    const fakeInput = this.createFakeInputForDemo(inputEl);
    
    this.document.body.appendChild(fakeInput);
    
    fakeInput.focus({preventScroll: true});
    
    setTimeout(() => {
      inputEl.focus({preventScroll: true});
      
      setTimeout(() => {
        if (fakeInput.parentNode) {
          fakeInput.parentNode.removeChild(fakeInput);
        }
        
        setTimeout(() => {
          this.showDebugElement = false;
        }, 2000);
      }, 500);
    }, 300);
  }
  
  private createFakeInputForDemo(originalInput: HTMLInputElement): HTMLInputElement {
    const fakeInput = this.renderer.createElement('input') as HTMLInputElement;
    const rect = originalInput.getBoundingClientRect();
    
    if (originalInput.hasAttribute('type')) {
      fakeInput.setAttribute('type', originalInput.getAttribute('type') || 'text');
    }
    if (originalInput.hasAttribute('inputmode')) {
      fakeInput.setAttribute('inputmode', originalInput.getAttribute('inputmode') || '');
    }
    fakeInput.style.height = `${rect.height}px`;
    fakeInput.style.width = `${rect.width / 2}px`;
    fakeInput.style.position = 'fixed';
    fakeInput.style.zIndex = '999999';
    fakeInput.style.caretColor = 'transparent';
    fakeInput.style.border = '2px dashed #ff9800';
    fakeInput.style.outline = 'none';
    fakeInput.style.color = 'transparent';
    fakeInput.style.background = 'rgba(255, 152, 0, 0.1)';
    fakeInput.style.cursor = 'none';
    fakeInput.style.fontSize = '16px';
    fakeInput.style.top = `${rect.top}px`;
    fakeInput.style.left = `${rect.left}px`;
    fakeInput.style.borderRadius = '4px';
    
    const label = this.renderer.createElement('div') as HTMLDivElement;
    label.textContent = 'Temporary Input';
    label.style.position = 'absolute';
    label.style.top = '50%';
    label.style.left = '50%';
    label.style.transform = 'translate(-50%, -50%)';
    label.style.fontSize = '12px';
    label.style.color = '#ff9800';
    label.style.whiteSpace = 'nowrap';
    label.style.pointerEvents = 'none';
    
    fakeInput.appendChild(label);
    
    return fakeInput;
  }
}
