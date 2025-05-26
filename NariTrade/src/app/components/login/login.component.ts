import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  correo: string = '';
  clave: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

onSubmit() {
  this.errorMessage = '';

  if (!this.correo || !this.clave) {
    this.errorMessage = 'Todos los campos son obligatorios.';
    return;
  }

  this.authService.login(this.correo, this.clave).subscribe({
    next: (response) => {
      // ✅ Guardamos el token
      localStorage.setItem('token', response.token);

      // ✅ También podrías guardar usuario y rol si deseas
      localStorage.setItem('usuario', response.usuario);
      localStorage.setItem('rol', response.usuarioRol);

      // Redirigir
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Error al iniciar sesión.';
    },
  });
}}
