import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NaryComponentsComponent } from './components/nary-components/nary-components.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NaryComponentsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'NariTrade';
}
