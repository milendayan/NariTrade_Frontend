import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { ArticuloService } from '../../services/articulo.services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  productos: any[] = [];
  isLoading: boolean = true;

  constructor(
    public authService: AuthService,
    private router: Router,
    private articuloService: ArticuloService
  ) {}

  ngOnInit(): void {
    this.cargarArticulos();
  }

  cargarArticulos() {
    this.isLoading = true;

    if (this.authService.currentUserValue?.rol === 'admin') {
      this.articuloService.getAllArticulos().subscribe({
        next: (data) => {
          this.productos = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar artículos:', err);
          this.isLoading = false;
        },
      });
    } else {
      this.articuloService.getArticulos().subscribe({
        next: (data) => {
          this.productos = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar artículos:', err);
          this.isLoading = false;
        },
      });
    }
  }

  logout() {
    this.authService.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  trade(productoId: string) {
    this.router.navigate(['/trade', productoId]);
  }
}
