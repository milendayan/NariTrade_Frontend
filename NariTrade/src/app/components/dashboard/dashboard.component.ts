import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.services';

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
  productoSeleccionado: string = '';

  private apiUrl = 'http://localhost:3070/NariTrade/comercio';

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.currentUserValue) {
      // Usuario no autenticado, redirigir al login
      this.router.navigate(['/login']);
    } else {
      // Usuario autenticado, cargar productos
      this.listarProductos();
    }
  }

  listarProductos() {
    this.isLoading = true;

    const token = localStorage.getItem('token'); // o de donde estés guardando el JWT
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.http.get<any[]>(`${this.apiUrl}/items`, { headers }).subscribe({
      next: (data) => {
        this.productos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.isLoading = false;
      },
    });
  }

  logout() {
    this.authService.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  seleccionarMiProducto(productoId: string) {
    this.productoSeleccionado = productoId;
    alert('Producto seleccionado para ofrecer en trueque.');
  }

  solicitarTrueque(producto: any): void {
    localStorage.setItem('productoDeseado', JSON.stringify(producto));
    this.router.navigate(['/ofertar']); // Redirige al componente Ofertar
  }
}
