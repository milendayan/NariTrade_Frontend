import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.services'; // Asegúrate que la ruta sea correcta
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule], // Elimina NaryComponentsComponent si no lo usas
  template: `
    <div class="app-container">
      <!-- Barra de navegación -->
      <nav *ngIf="authService.currentUserValue" class="navbar">
        <h1>NariTrade</h1>
        <button (click)="logout()">Cerrar sesión</button>
      </nav>

      <!-- Contenido principal -->
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
        // Redirige al login después de cerrar sesión
        window.location.href = '/login'; // O usa Router si lo prefieres
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      },
    });
  }
}
