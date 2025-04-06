import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxAutofocusDirective } from 'ngx-autofocus';

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
          <p *ngIf="isIosDevice" class="ios-note">
            <strong>Note:</strong> <span class="highlight">On iOS, you need to tap once on the input to show the keyboard.</span><br>
            <small>This is due to a WebKit limitation where programmatic focus doesn't trigger the keyboard (<a href="https://bugs.webkit.org/show_bug.cgi?id=243416" target="_blank" rel="noopener">WebKit bug #243416</a>). Apple is working on a fix, but it's not yet released in stable iOS versions.</small>
          </p>
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

      <div class="focus-toggle">
        <p>Toggle focus on textarea:</p>
        <div class="focus-buttons">
          <button (click)="focusOnInput()" [class.active]="!iosTextareaFocus">Focus on Input</button>
          <button (click)="focusOnTextarea()" [class.active]="iosTextareaFocus">Focus on Textarea</button>
        </div>
      </div>

      <div class="handler-info">
        <h3>Current Handler: <span class="highlight">{{simulateIos || isIosDevice ? 'NgxIosAutofocusHandler' : 'NgxDefaultAutofocusHandler'}}</span></h3>
        <div class="simple-info">
          <p>Этот демо показывает, как работает автофокус на iOS устройствах с использованием нашего специального обработчика.</p>
          <p>Основное преимущество: <strong>клавиатура появляется автоматически</strong> при фокусировке на элементах ввода.</p>
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

    .form-group input, .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-group textarea {
      min-height: 120px;
      resize: vertical;
    }

    .form-group input:focus, .form-group textarea:focus {
      border-color: #4285f4;
      box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
      outline: none;
    }

    .form-group small {
      display: block;
      margin-top: 8px;
      color: #666;
      font-size: 14px;
    }

    .focus-toggle {
      margin-bottom: 30px;
    }

    .focus-buttons {
      display: flex;
      gap: 10px;
    }

    .focus-buttons button {
      padding: 10px 15px;
      background-color: #f1f1f1;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .focus-buttons button.active {
      background-color: #4285f4;
      color: white;
      border-color: #4285f4;
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

    .simple-info {
      margin-top: 10px;
    }

    .simple-info p {
      margin: 10px 0;
    }
  `]
})
export class IosDemoComponent {
  @ViewChild('iosInputEl') iosInputEl!: ElementRef<HTMLInputElement>;
  @ViewChild('iosTextareaEl') iosTextareaEl!: ElementRef<HTMLTextAreaElement>;

  iosInput = '';
  iosTextarea = '';
  iosTextareaFocus = false;
  isIosDevice = false;
  simulateIos = false;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    // Check if running on iOS
    const userAgent = navigator.userAgent || '';
    this.isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !/Windows Phone/.test(userAgent);
  }

  toggleIosSimulation(): void {
    this.simulateIos = !this.simulateIos;
    
    if (this.simulateIos) {
      // When enabling simulation, clear inputs
      this.iosInput = '';
      this.iosTextarea = '';
    }
  }

  focusOnInput(): void {
    this.iosTextareaFocus = false;
    setTimeout(() => {
      const inputEl = this.document.getElementById('ios-input') as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
      }
    }, 100);
  }

  focusOnTextarea(): void {
    this.iosTextareaFocus = true;
    setTimeout(() => {
      const textareaEl = this.document.getElementById('ios-textarea') as HTMLTextAreaElement;
      if (textareaEl) {
        textareaEl.focus();
      }
    }, 100);
  }
}
