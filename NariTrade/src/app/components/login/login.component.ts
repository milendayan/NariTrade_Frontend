import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html', // Referencia al archivo HTML
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  correo: string = '';
  clave: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';

    this.authService.login(this.correo, this.clave).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al iniciar sesión';
      },
    });
  }
}
