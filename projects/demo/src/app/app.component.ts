import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { IosDemoComponent } from './ios-demo/ios-demo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxAutofocusDirective } from 'ngx-autofocus';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgxAutofocusDirective, IosDemoComponent],
  template: `
    <div class="container">
      <h1>NgxAutofocus Demo</h1>

      <div class="intro">
        <p>This demo showcases the various features of the <code>ngxAutofocus</code> directive. Select a tab below to see different usage scenarios.</p>

        <div class="code-examples">
          <h3>How to use in your project:</h3>
          <pre><code>// Import the directive
import &#123; NgxAutofocusDirective &#125; from 'ngx-autofocus';

// Add to your component imports
&#64;Component(&#123;
  // ...
  imports: [NgxAutofocusDirective],
&#125;)

// Use in your template
&lt;input ngxAutofocus&gt;                 // Always focus
&lt;input [ngxAutofocus]="condition"&gt;   // Conditional focus</code></pre>
        </div>
      </div>

      <div class="tabs">
        <button
          *ngFor="let tab of tabs"
          [class.active]="activeTab === tab.id"
          (click)="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Basic Demo -->
      <div class="tab-content" *ngIf="activeTab === 'basic'">
        <h2>Basic Usage</h2>
        <div class="instructions">
          <p>This tab demonstrates the basic usage of the <code>ngxAutofocus</code> directive:</p>
          <ul>
            <li>The "Name" field automatically receives focus when the page loads because it has the <code>ngxAutofocus</code> directive without parameters</li>
            <li>Try checking the "Enable conditional autofocus" checkbox to see how the focus moves to the "Message" field</li>
          </ul>
        </div>
        <div class="form-group">
          <label for="name">Name (autofocused):</label>
          <input id="name" type="text" ngxAutofocus [(ngModel)]="name">
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="email" [(ngModel)]="email">
        </div>

        <div class="form-group checkbox-group">
          <div class="checkbox-container">
            <input type="checkbox" id="enable-focus" [(ngModel)]="enableFocus">
            <label for="enable-focus">Enable conditional autofocus:</label>
          </div>
        </div>

        <div class="form-group">
          <label for="message">Message (conditional autofocus):</label>
          <textarea id="message" [ngxAutofocus]="enableFocus" [(ngModel)]="message"></textarea>
        </div>
      </div>

      <!-- Conditional Demo -->
      <div class="tab-content" *ngIf="activeTab === 'conditional'">
        <h2>Conditional Autofocus</h2>
        <div class="instructions">
          <p>This tab demonstrates how to conditionally apply autofocus:</p>
          <ul>
            <li>Check the "Enable autofocus on the input below" checkbox to apply focus to the input field</li>
            <li>Click the "Toggle Autofocus" button to toggle focus on and off</li>
            <li>Notice how the focus is applied immediately when the condition changes to true</li>
          </ul>
        </div>
        <p>This demo shows how to conditionally apply autofocus.</p>

        <div class="form-group checkbox-group">
          <div class="checkbox-container">
            <input type="checkbox" id="conditional-focus" [(ngModel)]="conditionalFocus">
            <label for="conditional-focus">Enable autofocus on the input below:</label>
          </div>
        </div>

        <div class="form-group">
          <label for="conditional-input">Conditional input:</label>
          <input id="conditional-input" type="text" [ngxAutofocus]="conditionalFocus" [(ngModel)]="conditionalInput">
        </div>

        <button (click)="toggleConditionalFocus()">Toggle Autofocus</button>
      </div>

      <!-- Dynamic Content Demo -->
      <div class="tab-content" *ngIf="activeTab === 'dynamic'">
        <h2>Dynamic Content</h2>
        <div class="instructions">
          <p>This tab demonstrates how autofocus works with dynamically created elements:</p>
          <ul>
            <li>Click the "Add New Input" button to add a new input field</li>
            <li>Notice how each new field automatically receives focus when added</li>
            <li>This is achieved by using <code>[ngxAutofocus]="i === dynamicInputs.length - 1"</code> on each input</li>
            <li>Use "Clear All" to remove all fields and start over</li>
          </ul>
        </div>
        <p>This demo shows autofocus with dynamically created elements.</p>

        <div class="form-group">
          <button (click)="addDynamicInput()">Add New Input</button>
          <button (click)="clearDynamicInputs()">Clear All</button>
        </div>

        <div class="dynamic-container">
          <div class="form-group" *ngFor="let input of dynamicInputs; let i = index">
            <label for="dynamic-{{i}}">Input {{i + 1}}:</label>
            <input
              id="dynamic-{{i}}"
              type="text"
              [ngxAutofocus]="i === dynamicInputs.length - 1"
              [(ngModel)]="input.value">
          </div>
        </div>
      </div>

      <!-- Synchronous Handler Demo -->
      <div class="tab-content" *ngIf="activeTab === 'sync'">
        <h2>Synchronous Handler</h2>
        <div class="instructions">
          <p>This tab demonstrates the difference between the default handler and the synchronous handler:</p>
          <ul>
            <li>The default handler uses a small delay to handle animations and timing issues</li>
            <li>The synchronous handler focuses elements immediately without any delay</li>
            <li>You can see the difference by clicking the buttons below</li>
          </ul>
        </div>

        <div class="handler-comparison">
          <div class="handler-column">
            <h3>Default Handler</h3>
            <p>Uses a small delay for better compatibility with animations</p>
            <button (click)="showDefaultHandlerDemo()" class="demo-btn">Show Default Handler Demo</button>

            <div *ngIf="showDefaultDemo" class="demo-container">
              <div class="loading-overlay" *ngIf="defaultFocusTime === 0">
                <div class="loading-spinner"></div>
                <div class="loading-text">Waiting for focus...</div>
              </div>
              <div class="form-group">
                <label for="default-input">Input with Default Handler:</label>
                <input id="default-input" type="text" [(ngModel)]="defaultInput" placeholder="Default handler focus">
                <div class="timer">
                  <span *ngIf="defaultFocusTime > 0">Focus time: {{defaultFocusTime}}ms</span>
                  <span *ngIf="defaultFocusTime === 0" class="waiting">Focusing...</span>
                </div>
                <div *ngIf="defaultFocusTime > 0" class="delay-info">
                  <span *ngIf="defaultFocusTime > syncFocusTime">⏱️ {{defaultFocusTime - syncFocusTime}}ms slower than synchronous</span>
                </div>
              </div>
            </div>
          </div>

          <div class="handler-column">
            <h3>Synchronous Handler</h3>
            <p>Immediately focuses without any delay</p>
            <button (click)="showSyncHandlerDemo()" class="demo-btn">Show Synchronous Handler Demo</button>

            <div *ngIf="showSyncDemo" class="demo-container">
              <div class="loading-overlay" *ngIf="syncFocusTime === 0">
                <div class="loading-spinner fast-spinner"></div>
                <div class="loading-text">Focusing immediately...</div>
              </div>
              <div class="form-group">
                <label for="sync-input">Input with Synchronous Handler:</label>
                <input id="sync-input" type="text" [(ngModel)]="syncInput" placeholder="Synchronous handler focus">
                <div class="timer">
                  <span *ngIf="syncFocusTime > 0">Focus time: {{syncFocusTime}}ms</span>
                  <span *ngIf="syncFocusTime === 0" class="waiting">Focusing...</span>
                </div>
                <div *ngIf="syncFocusTime > 0" class="delay-info highlight">
                  <span *ngIf="defaultFocusTime > syncFocusTime">⚡ {{defaultFocusTime - syncFocusTime}}ms faster than default</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="handler-info">
          <h3>When to use the Synchronous Handler:</h3>
          <ul>
            <li>When you need immediate focus without any delay</li>
            <li>In performance-critical applications where every millisecond counts</li>
            <li>When you're handling focus timing yourself and don't need the built-in delay</li>
          </ul>
          <p><strong>Note:</strong> The synchronous handler is provided as a separate implementation that you can use by configuring the NgxAutofocusModule.</p>
        </div>
      </div>

      <!-- iOS Demo -->
      <div class="tab-content" *ngIf="activeTab === 'ios'">
        <h2>iOS Support</h2>
        <div class="instructions">
          <p>This tab demonstrates the iOS-specific autofocus handler:</p>
          <ul>
            <li>NgxAutofocus includes a special handler for iOS devices that works around iOS focus limitations</li>
            <li>The iOS handler automatically activates when the library detects an iOS device</li>
            <li>It uses a special technique with a temporary input element to ensure reliable focusing</li>
            <li>This solves common iOS issues like keyboard not appearing or focus not working properly</li>
          </ul>
        </div>

        <!-- Use the dedicated iOS demo component -->
        <app-ios-demo></app-ios-demo>
      </div>

      <!-- Button Click Demo -->
      <div class="tab-content" *ngIf="activeTab === 'button-click'">
        <h2>Button Click Demo</h2>
        <div class="instructions">
          <p>This tab demonstrates how to show an input field with autofocus after clicking a button:</p>
          <ul>
            <li>Click the "Show Input Field" button to display an input field</li>
            <li>The input field will automatically receive focus as soon as it appears</li>
            <li>This is useful for forms that are conditionally displayed based on user interaction</li>
          </ul>
        </div>

        <div class="form-group">
          <button (click)="showInput = !showInput">
            {{ showInput ? 'Hide Input Field' : 'Show Input Field' }}
          </button>
        </div>

        <div class="form-group" *ngIf="showInput">
          <label for="button-click-input">Input field:</label>
          <input 
            id="button-click-input" 
            type="text" 
            ngxAutofocus 
            placeholder="This input received focus automatically">
        </div>
      </div>

      <div class="actions">
        <button (click)="reset()" class="reset-btn">Reset All</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      background-color: #f9f9f9;
      display: block;
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }

    .container {
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      margin-top: 20px;
      margin-bottom: 20px;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    .instructions {
      background-color: #f0f7ff;
      border-left: 4px solid #4285f4;
      padding: 20px;
      margin-bottom: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(66, 133, 244, 0.1);
    }

    .instructions ul {
      margin-top: 10px;
      padding-left: 20px;
    }

    .instructions li {
      margin-bottom: 5px;
    }

    .code-examples {
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .code-examples pre {
      background-color: #282c34;
      color: #abb2bf;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }

    .code-examples code {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 14px;
      line-height: 1.5;
    }

    h1 {
      color: #333;
      font-size: 32px;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 600;
    }

    h2 {
      color: #444;
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 500;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 10px;
    }

    h3 {
      color: #555;
      font-size: 20px;
      margin-bottom: 15px;
      font-weight: 500;
    }

    .platform-info {
      background-color: #f5f5f5;
      padding: 10px 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }

    .platform-info p {
      margin: 5px 0;
    }

    .tabs {
      display: flex;
      margin-bottom: 30px;
      border-bottom: 2px solid #eaeaea;
      gap: 10px;
      position: relative;
    }

    .tabs button {
      padding: 12px 20px;
      background: none;
      border: none;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      font-weight: 500;
      transition: all 0.2s ease;
      color: #666;
      border-radius: 4px 4px 0 0;
      position: relative;
      z-index: 1;
      margin-bottom: -2px;
    }

    .tabs button:hover {
      background-color: #f5f5f5;
      color: #333;
    }

    .tabs button.active {
      border-bottom: 2px solid #4285f4;
      color: #4285f4;
      background-color: rgba(66, 133, 244, 0.05);
    }

    .tab-content {
      padding: 25px;
      background-color: #ffffff;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .container {
      max-width: 800px;
      border: 1px solid #eaeaea;
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
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

    input:hover, textarea:hover {
      border-color: #bbb;
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

    small {
      display: block;
      color: #666;
      margin-top: 4px;
    }

    .handler-selector {
      margin-bottom: 20px;
    }

    .handler-info {
      background-color: #f0f0f0;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }

    .handler-info pre {
      white-space: pre-wrap;
      font-family: monospace;
      margin: 0;
    }

    .options-form {
      margin-bottom: 20px;
    }

    .demo-area {
      background-color: #fff;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .test-container {
      margin-top: 15px;
      padding: 15px;
      border: 1px dashed #ccc;
      border-radius: 4px;
      min-height: 100px;
    }

    button:not(.tabs button) {
      padding: 12px 20px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 20px;
      margin-bottom: 15px;
      font-weight: 500;
      font-size: 15px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    button:not(.tabs button):hover {
      background-color: #3367d6;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    button:not(.tabs button):active {
      transform: translateY(1px);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    button.danger {
      background-color: #ea4335;
    }

    button.danger:hover {
      background-color: #d33426;
    }

    .reset-btn {
      display: block;
      margin: 30px auto;
      background-color: #ea4335;
      color: white;
      border: none;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .reset-btn:hover {
      background-color: #d33426;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .actions {
      text-align: center;
      margin-top: 30px;
    }

    .dynamic-container {
      margin-top: 25px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      border: 1px solid #eaeaea;
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

    .handler-comparison {
      display: flex;
      gap: 20px;
      margin: 30px 0;
    }

    .handler-column {
      flex: 1;
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #eaeaea;
    }

    .handler-column h3 {
      margin-top: 0;
      color: #4285f4;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 10px;
    }

    .demo-btn {
      width: 100%;
      margin-top: 15px;
      background-color: #4285f4;
    }



    .timer {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
      font-weight: 500;
    }

    .delay-info {
      font-size: 13px;
      margin-top: 5px;
      font-style: italic;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10;
      border-radius: 6px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #4285f4;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .fast-spinner {
      border-top: 4px solid #34a853;
      animation: spin 0.3s linear infinite;
    }

    .loading-text {
      margin-top: 10px;
      font-weight: 500;
    }

    .waiting {
      color: #4285f4;
      font-weight: 500;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .demo-container {
      position: relative;
      margin-top: 20px;
      padding: 15px;
      background-color: white;
      border-radius: 6px;
      border: 1px solid #eaeaea;
      min-height: 120px;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  // Basic demo fields
  name = '';
  email = '';
  message = '';
  enableFocus = false;

  // Tab navigation
  tabs = [
    { id: 'basic', name: 'Basic Usage' },
    { id: 'conditional', name: 'Conditional' },
    { id: 'dynamic', name: 'Dynamic Content' },
    { id: 'ios', name: 'iOS Support' },
    { id: 'sync', name: 'Synchronous Handler' },
    { id: 'button-click', name: 'Button Click' }
  ];
  activeTab = 'basic';

  // Conditional demo fields
  conditionalFocus = false;
  conditionalInput = '';

  // Dynamic demo fields
  dynamicInputs: Array<{value: string}> = [];

  // iOS demo fields are now handled by the IosDemoComponent

  // Button click demo fields
  showInput = false;

  // Synchronous handler demo fields
  defaultInput = '';
  syncInput = '';
  showDefaultDemo = false;
  showSyncDemo = false;
  defaultFocusTime = 0;
  syncFocusTime = 0;

  ngOnInit(): void {
  }

  toggleConditionalFocus(): void {
    this.conditionalFocus = !this.conditionalFocus;
  }

  addDynamicInput(): void {
    this.dynamicInputs.push({ value: '' });
  }

  clearDynamicInputs(): void {
    this.dynamicInputs = [];
  }

  // iOS simulation is now handled by the IosDemoComponent

  showDefaultHandlerDemo(): void {
    this.defaultInput = '';
    this.defaultFocusTime = 0;
    this.showDefaultDemo = false;

    setTimeout(() => {
      const startTime = performance.now();
      this.showDefaultDemo = true;

      setTimeout(() => {
        setTimeout(() => {
          const inputElement = document.getElementById('default-input') as HTMLInputElement;
          if (inputElement) {
            inputElement.focus();
            this.defaultFocusTime = Math.round(performance.now() - startTime);
          }
        }, 1500);
      }, 500);
    }, 100);
  }

  showSyncHandlerDemo(): void {
    this.syncInput = '';
    this.syncFocusTime = 0;
    this.showSyncDemo = false;

    setTimeout(() => {
      const startTime = performance.now();
      this.showSyncDemo = true;

      setTimeout(() => {
        const inputElement = document.getElementById('sync-input') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          this.syncFocusTime = Math.round(performance.now() - startTime);
        }
      }, 50);
    }, 100);
  }

  reset(): void {
    this.name = '';
    this.email = '';
    this.message = '';
    this.enableFocus = false;

    this.conditionalFocus = false;
    this.conditionalInput = '';

    this.dynamicInputs = [];

    this.defaultInput = '';
    this.syncInput = '';
    this.showDefaultDemo = false;
    this.showSyncDemo = false;
    this.defaultFocusTime = 0;
    this.syncFocusTime = 0;

    this.showInput = false;

    this.activeTab = 'basic';
  }
}
