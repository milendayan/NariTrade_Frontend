import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-anuncios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Asegúrate de importar RouterModule
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css']
})
export class AnunciosComponent implements OnInit {
  items: any[] = [];
  isLoading = true;
  selectedItem: any = null;
  apiUrl = 'http://localhost:3070/NariTrade/items/mis';
  private apiUr1 = 'http://localhost:3070/NariTrade';

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
    } else {
      this.listarMisAnuncios();
    }
  }

  listarMisAnuncios(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar anuncios:', err);
        this.isLoading = false;
      }
    });
  }

  editar(item: any) {
    this.selectedItem = item;
  }

  guardarCambios() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.put(
      `http://localhost:3070/NariTrade/items/update/${this.selectedItem._id}`,
      this.selectedItem,
      { headers }
    )
    .subscribe({
      next: () => {
        alert('Artículo actualizado.');
        this.selectedItem = null;
      },
      error: (err) => {
        alert('Error al actualizar artículo.');
        console.error(err);
      }
    });
  }

  cancelar() {
    this.selectedItem = null;
  }

  eliminar(itemId: string) {
    if (!confirm('¿Seguro que deseas eliminar este anuncio?')) return;

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete(`http://localhost:3070/NariTrade/items/delete/${itemId}`, { headers })
      .subscribe({
        next: () => {
          alert('Artículo eliminado.');
          this.items = this.items.filter(item => item._id !== itemId);
          if (this.selectedItem && this.selectedItem._id === itemId) {
            this.selectedItem = null;
          }
        },
        error: (err) => {
          alert('Error al eliminar artículo.');
          console.error(err);
        }
      });
  }

  // ✅ NUEVO MÉTODO PARA CERRAR SESIÓN
logout() {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  this.http.post(`${this.apiUr1}/logout`, {}, { headers }).subscribe({
    next: () => {
      console.log('Sesión cerrada correctamente');
    },
    error: (err) => {
      console.error('Error al cerrar sesión:', err);
    },
    complete: () => {
      // Siempre limpiar el estado y redirigir
      this.authService.clearCurrentUser();
      this.router.navigate(['/login']);
    }
  });
}
  onImageChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    const nuevasImagenes: string[] = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        nuevasImagenes.push(e.target.result);

        if (nuevasImagenes.length === files.length && this.selectedItem) {
          this.selectedItem.img = nuevasImagenes;
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

}
