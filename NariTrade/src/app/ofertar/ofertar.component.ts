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
})
export class OfertarComponent implements OnInit {
  productoDeseado: any;
  productosPropios: any[] = [];
  productoOferta: any;
  misArticulos: any;
  misPropuestas: any[] = [];
  misSolicitudes: any[] = [];
 trueques: any[] = [];

  private apiUrl = 'http://localhost:3070/NariTrade';
mostrarPropuestas = true;
mostrarSolicitudes = false;


  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
  ) {}

ngOnInit(): void {
  const productoGuardado = localStorage.getItem('productoDeseado');
  if (productoGuardado) {
    this.productoDeseado = JSON.parse(productoGuardado);
  }

  this.cargarProductosPropios();
  this.obtenerMisPropuestas();
  this.obtenerMisSolicitudes();
  this.cargarTrueques();  // nuevo método
}

togglePropuestas(): void {
  this.mostrarPropuestas = !this.mostrarPropuestas;
  if (this.mostrarPropuestas) {
    this.mostrarSolicitudes = false;
  }
}

toggleSolicitudes(): void {
  this.mostrarSolicitudes = !this.mostrarSolicitudes;
  if (this.mostrarSolicitudes) {
    this.mostrarPropuestas = false;
  }
}

cargarTrueques(): void {
  const headers = this.getAuthHeaders();
  this.http.get<any[]>(`${this.apiUrl}/trueque/misSolicitudes`, { headers }).subscribe({
    next: (data) => {
      console.log('Trueques encontrados:', data);
      this.trueques = data;
    },
    error: (err) => console.error('Error al cargar trueques:', err),
  });
}

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  cargarProductosPropios(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${this.apiUrl}/items/mis`, { headers }).subscribe({
      next: (data) => (this.misArticulos = data),
      error: (err) => console.error('Error al cargar productos del usuario:', err),
    });
  }

obtenerMisPropuestas(): void {
  const headers = this.getAuthHeaders();
  this.http.get<any>(`${this.apiUrl}/trueque/misPropuestas`, { headers }).subscribe({
    next: (data) => {
      this.misPropuestas = data.propuestas;  // CORREGIDO
    },
    error: (err) => console.error('Error al obtener propuestas:', err),
  });
}

obtenerMisSolicitudes(): void {
  const headers = this.getAuthHeaders();
  this.http.get<any>(`${this.apiUrl}/trueque/misSolicitudes`, { headers }).subscribe({
    next: (data) => {
      this.misSolicitudes = data.solicitudes; // <- esta es la clave correcta
    },
    error: (err) => console.error('Error al obtener solicitudes:', err),
  });
}


aceptarTrueque(idTrueque: string): void {
  const headers = this.getAuthHeaders();
  console.log('ID enviado:', idTrueque);
  console.log('URL:', `${this.apiUrl}/aceptaTrueque/${idTrueque}`);
  console.log('Headers:', headers);

  this.http.put(`${this.apiUrl}/trueque/aceptaTrueque/${idTrueque}`, {}, { headers }).subscribe({
    next: () => {
      alert('Trueque aceptado con éxito');
      this.obtenerMisSolicitudes();
      this.obtenerMisPropuestas();
      this.cargarProductosPropios();
    },
    error: (err) => {
      console.error('Error al aceptar trueque:', err);
      alert(`Error: ${err.status} - ${err.error?.message || 'No se pudo aceptar el trueque'}`);
    },
  });
}


  seleccionarProductoOferta(producto: any): void {
    this.productoOferta = this.productoOferta?._id === producto._id ? null : producto;
  }

  enviarSolicitud(): void {
    if (!this.productoOferta || !this.productoDeseado) {
      alert('Debes seleccionar un producto para ofertar');
      return;
    }

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

    const headers = this.getAuthHeaders();

    this.http.post(
      `${this.apiUrl}/comercio/solicitar/${this.productoDeseado._id}/${this.productoOferta._id}`,
      {},
      { headers }
    ).subscribe({
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

  logout() {
    const headers = this.getAuthHeaders();
    this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
      next: () => console.log('Sesión cerrada correctamente'),
      error: (err) => console.error('Error al cerrar sesión:', err),
      complete: () => {
        this.authService.clearCurrentUser();
        this.router.navigate(['/login']);
      }
    });
  }
}
