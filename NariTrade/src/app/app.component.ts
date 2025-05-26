import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.services';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="app-container">
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/login'; // O usa Router.navigate(['/login']) si estás usando Router
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      },
    });
  }
}

