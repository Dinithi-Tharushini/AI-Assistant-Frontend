import { Component } from '@angular/core';

@Component({
  selector: 'app-widget',
  template: '<app-chat-widget></app-chat-widget>',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  `]
})
export class WidgetComponent {}
