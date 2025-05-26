import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticuloService {
  private apiUrl = 'http://localhost:3000/api/articulos'; // Ajusta la URL según tu API

  constructor(private http: HttpClient) {}

  getArticulos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis`);
  }

  getAllArticulos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
