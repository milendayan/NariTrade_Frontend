import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PublicarComponent } from './publicar/publicar.component';
import { RegistroComponent } from './registro/registro.component';
import { AnunciosComponent } from './anuncios/anuncios.component'; // ← Asegúrate que la ruta es correcta
import { authGuard } from './guards/auth.guard';
import { OfertarComponent } from './ofertar/ofertar.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'publicar',
    component: PublicarComponent,
    canActivate: [authGuard],
  },
  {
    path: 'anuncios', // ← Nueva ruta protegida
    component: AnunciosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ofertar', // ← Nueva ruta protegida
    component: OfertarComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
