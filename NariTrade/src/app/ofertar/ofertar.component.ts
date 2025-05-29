import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ofertar',
  templateUrl: './ofertar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./ofertar.component.css'],
  // 🚫 sin providers aquí
})
export class OfertarComponent implements OnInit {
  productoDeseado: any;
  productosPropios: any[] = [];
  productoOferta: any;
  misArticulos: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService // Cambiado a public para acceso en template
  ) {}

  ngOnInit(): void {
    const productoGuardado = localStorage.getItem('productoDeseado');
    if (productoGuardado) {
      this.productoDeseado = JSON.parse(productoGuardado);
    }

    this.cargarProductosPropios();
  }

  cargarProductosPropios(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<any[]>('http://localhost:3070/NariTrade/items/mis', { headers })
      .subscribe({
        next: (data) => {
          this.misArticulos = data;
        },
        error: (err) => {
          console.error('Error al cargar productos del usuario:', err);
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  seleccionarProductoOferta(producto: any): void {
    if (this.productoOferta?._id === producto._id) {
      this.productoOferta = null; // Deseleccionar
    } else {
      this.productoOferta = producto; // Seleccionar
    }
  }

  enviarSolicitud(): void {
    if (!this.productoOferta || !this.productoDeseado) {
      alert('Debes seleccionar un producto para ofertar');
      return;
    }

    // Validación de precios (tu código actual permanece igual)
    const precioDeseado = this.productoDeseado.precio;
    const precioOferta = this.productoOferta.precio;

    const margen = precioDeseado * 0.3;
    const precioMin = precioDeseado - margen;
    const precioMax = precioDeseado + margen;

    if (precioOferta < precioMin || precioOferta > precioMax) {
      alert(
        `El precio del producto que ofreces debe estar dentro del 30% del producto deseado.\n\n` +
          `Precio del producto deseado: $${precioDeseado}\n` +
          `Precio mínimo aceptado: $${precioMin}\n` +
          `Precio máximo aceptado: $${precioMax}\n\n` +
          `Tu producto ofrecido: $${precioOferta}`
      );
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // URL CORREGIDA (elimina /NariTrade y la doble barra)
    this.http
      .post(
       `http://localhost:3070/NariTrade/comercio/solicitar/${this.productoDeseado._id}/${this.productoOferta._id}`,
        {},
        { headers }
      )
      .subscribe({
        next: () => {
          alert('Solicitud enviada con éxito');
          localStorage.removeItem('productoDeseado');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          alert('Hubo un error al enviar la solicitud');
        },
      });
  }
}
