import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.services';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
    standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
productos: any[] = [];
  isLoading: boolean = true;
apiUrl = 'http://localhost:3070/NariTrade/comercio';

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUserValue?.rol !== 'admin') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.listarProductos();
  }

listarProductos() {
  this.isLoading = true;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  this.http.get<any[]>(`${this.apiUrl}/all`, { headers }).subscribe({
    next: (data) => {
      this.productos = data;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error al listar productos:', err);
      this.isLoading = false;
      alert('No se pudieron cargar los productos. Intenta de nuevo más tarde.');
    }
  });
}

cambiarEstado(productoId: string, estado: string) {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const url =
    estado === 'Publicado'
      ? `${this.apiUrl}/updateBloqueado/${productoId}`
      : `${this.apiUrl}/updateDesbloqueado/${productoId}`;

  this.http.put(url, {}, { headers }).subscribe({
    next: () => {
      this.listarProductos();
    },
    error: () => {
      alert('Error al cambiar el estado del producto');
    }
  });
}

  logout() {
    this.authService.clearCurrentUser();
    this.router.navigate(['/login']);
  }

}

