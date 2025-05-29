import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3070/NariTrade';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        try {
          this.currentUserSubject.next(JSON.parse(usuarioGuardado));
        } catch (e) {
          this.currentUserSubject.next(null);
        }
      }
    }
  }

  login(correo: string, clave: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, { correo, clave }).pipe(
tap((res: any) => {
  if (this.isBrowser) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('usuario', JSON.stringify({
      ...res.usuario,
      role: res.usuarioRol, // ← agrega aquí el rol
    }));
  }

  // Guarda el usuario con rol en el currentUserSubject
  this.currentUserSubject.next({
    ...res.usuario,
    role: res.usuarioRol,
  });
})

    );
  }

  logout(): Observable<any> {
    const token = this.isBrowser ? localStorage.getItem('token') : null;

    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).pipe(
      tap(() => {
        this.clearCurrentUser();
        if (this.isBrowser) {
          localStorage.clear();
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isBrowser && !!localStorage.getItem('token');
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }

clearCurrentUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  this.currentUserSubject.next(null);
}

}