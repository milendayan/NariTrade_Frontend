import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './publicar.component.html',
  styleUrls: ['./publicar.component.css']
})
export class PublicarComponent implements OnInit {
  formArticulo: FormGroup;
  imagenes: string[] = [];
  private apiUrl = 'http://localhost:3070/NariTrade/items';
  private apiUr1 = 'http://localhost:3070/NariTrade';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private http: HttpClient
  ) {
    this.formArticulo = this.fb.group({
      titulo: ['', Validators.required],
      descri: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      img: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.currentUserValue) {
      // Usuario no autenticado, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  onImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      this.imagenes = [];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenes.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

      this.formArticulo.patchValue({ img: this.imagenes });
    }
  }

  publicarArticulo(): void {
    if (this.formArticulo.valid) {
      const datosArticulo = {
        ...this.formArticulo.value,
        img: this.imagenes
      };

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post(`${this.apiUrl}/new`, datosArticulo, { headers }).subscribe({
        next: () => {
          alert('Artículo publicado con éxito');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error al publicar:', err);
          alert('Ocurrió un error al publicar el artículo');
        }
      });

    } else {
      console.warn('Formulario inválido');
    }
  }

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

}
