import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.services';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {
  userForm: FormGroup;
  cargando: boolean = false;
  mensaje: string = '';
  private apiUrl = 'http://localhost:3070/NariTrade/User';
  private apiUr1 = 'http://localhost:3070/NariTrade';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService
  ) {
    this.userForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', Validators.minLength(7)],
      departamento: [''],
      clave: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
    } else {
      this.cargarDatosUsuario();
    }
  }

  cargarDatosUsuario() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`${this.apiUrl}/search`, { headers }).subscribe({
      next: (data) => {
        this.userForm.patchValue({
          correo: data.correo || '',
          celular: data.celular || '',
          departamento: data.departamento || '',
          clave: ''
        });
      },
      error: (err) => {
        console.error('Error cargando datos del usuario:', err);
        this.mensaje = 'Error al cargar los datos del usuario.';
      }
    });
  }

  guardarCambios() {
    if (this.userForm.invalid) {
      this.mensaje = 'Por favor, complete correctamente el formulario.';
      return;
    }

    this.cargando = true;
    const datosActualizar = this.userForm.value;

    if (!datosActualizar.clave) {
      delete datosActualizar.clave;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.put(`${this.apiUrl}/update`, datosActualizar, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Datos actualizados correctamente';
        this.cargando = false;
        this.userForm.patchValue({ clave: '' });
      },
      error: (err) => {
        console.error('Error al actualizar los datos:', err);
        this.mensaje = 'Error al actualizar los datos';
        this.cargando = false;
      }
    });
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
        this.authService.clearCurrentUser();
        this.router.navigate(['/login']);
      }
    });
  }
}
