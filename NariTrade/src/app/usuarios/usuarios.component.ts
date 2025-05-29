import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  usuarioBuscado: any = null;
  busquedaId: string = '';
  busquedaNombre: string = '';

  apiUrl = 'http://localhost:3070/NariTrade/User';
  private apiUr1 = 'http://localhost:3070/NariTrade';

  usuarioEnEdicion: string | null = null;
  usuarioEditandoBackup: any = null;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosUsuarios();
  }

  logout() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post(`${this.apiUr1}/logout`, {}, { headers }).subscribe({
      next: () => console.log('Sesión cerrada correctamente'),
      error: (err) => console.error('Error al cerrar sesión:', err),
      complete: () => {
        this.authService.clearCurrentUser();
        this.router.navigate(['/login']);
      }
    });
  }

  obtenerTodosLosUsuarios() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(`${this.apiUrl}/all`, { headers }).subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.usuarios = [];
      }
    });
  }

  buscarUsuarioPorNombre() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const nombre = this.busquedaNombre.trim().toLowerCase();

    if (!nombre) {
      this.obtenerTodosLosUsuarios();
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/all`, { headers }).subscribe({
      next: (data) => {
        this.usuarios = data.filter(user => user.nombre.toLowerCase().includes(nombre));
      },
      error: (err) => {
        console.error('Error al buscar usuario:', err);
        this.usuarios = [];
      }
    });
  }

  trackById(index: number, item: any): string {
    return item._id;
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.delete(`${this.apiUrl}/delete/${id}`, { headers }).subscribe({
        next: () => {
          console.log('Usuario eliminado');
          this.obtenerTodosLosUsuarios();
        },
        error: (err) => console.error('Error al eliminar usuario:', err)
      });
    }
  }

  // Edición en línea
  activarEdicion(usuario: any) {
    this.usuarioEnEdicion = usuario._id;
    this.usuarioEditandoBackup = { ...usuario };
  }

  cancelarEdicion() {
    if (this.usuarioEditandoBackup) {
      const index = this.usuarios.findIndex(u => u._id === this.usuarioEditandoBackup._id);
      if (index !== -1) {
        this.usuarios[index] = { ...this.usuarioEditandoBackup };
      }
    }
    this.usuarioEnEdicion = null;
    this.usuarioEditandoBackup = null;
  }

  guardarEdicion(usuario: any) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.put(`${this.apiUrl}/update/${usuario._id}`, usuario, { headers }).subscribe({
      next: () => {
        console.log('Usuario actualizado');
        this.usuarioEnEdicion = null;
        this.usuarioEditandoBackup = null;
      },
      error: (err) => console.error('Error al actualizar usuario:', err)
    });
  }
}
