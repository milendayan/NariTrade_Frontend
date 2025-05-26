import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  nombre = '';
  apellido = '';
  tipoDocumento = '';
  genero = '';
  numDocumento = '';
  fechaNacimiento = ''; // en formato 'DD/MM/YYYY'
  celular = '';
  correo = '';
  clave = '';
  confirmarClave = '';
  departamento = '';
  errorMessage = '';

  private apiUrl = 'http://localhost:3070/NariTrade/User';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister(): void {
    // ✅ Validación de campos vacíos en frontend
    if (!this.nombre || !this.apellido || !this.tipoDocumento || !this.genero || !this.numDocumento ||
        !this.fechaNacimiento || !this.celular || !this.correo || !this.clave || !this.departamento) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.clave !== this.confirmarClave) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const partes = this.fechaNacimiento.split('/');
    const fechaFormateada = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);

    const data = {
      nombre: this.nombre,
      apellido: this.apellido,
      tipoDocumento: this.tipoDocumento,
      genero: this.genero,
      numDocumento: this.numDocumento,
      fechaNacimiento: fechaFormateada,
      celular: this.celular,
      correo: this.correo,
      clave: this.clave,
      departamento: this.departamento,
    };

    this.http.post(`${this.apiUrl}/SignUp`, data).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        if (err.error?.message?.startsWith('User validation failed')) {
          this.errorMessage = 'Todos los campos son obligatorios';
        } else if (err.error?.message === 'Usuario ya existe') {
          this.errorMessage = 'El usuario con ese correo o documento ya existe';
        } else {
          this.errorMessage = err.error?.message || err.message || 'Error al registrar';
        }
      },
    });
  }
}
