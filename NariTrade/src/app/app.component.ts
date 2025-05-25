import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MicomponenteComponent } from './components/micomponente/micomponente.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MicomponenteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'NariTrade';
}
