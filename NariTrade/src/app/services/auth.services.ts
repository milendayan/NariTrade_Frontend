// En auth.services.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3070/NariTrade';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(correo: string, clave: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, { correo, clave }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', res.usuario);
        localStorage.setItem('rol', res.usuarioRol);
        this.currentUserSubject.next(res); // Actualiza el observable
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  // Añade este método
  /*isLoggedIn(): boolean {
    return (
      typeof window !== 'undefined' && !!localStorage.getItem('currentUser')
    );
  }*/

  // O si usas localStorage:
  /*
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
  */

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .post(
        'http://localhost:3070/NariTrade/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap(() => {
          this.clearCurrentUser();
          localStorage.clear();
        })
      );
  }

  // Expón el valor actual como observable público
  public currentUser$ = this.currentUserSubject.asObservable();

  // Propiedad para acceder directamente al valor actual
  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Método para actualizar el usuario
  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }

  // Método para limpiar el usuario
  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}
