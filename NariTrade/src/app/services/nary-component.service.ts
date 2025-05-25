import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NaryComponentService {
  constructor(private http: HttpClient) { }
  apiUri = '/api/narycomponents';
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  getAllnaryData(): Observable<any> {
    return this.http.get<any>(this.apiUri);
  }
  newnary(data: any): Observable<any> {
    return this.http.post<any>(this.apiUri, data, {
      headers: this.httpOptions,
    });
  }
  updatenary(id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(this.apiUri + '/' + id, data, {
      headers: this.httpOptions,
    });
  }
  getOnenary(id: any): Observable<any> {
    return this.http.get<any>(this.apiUri + '/' + id, {
      headers: this.httpOptions,
    });
  }
  deleteNari(id: any) {
    return this.http.delete<any>(
      this.apiUri + "/" + id,
      { headers: this.httpOptions });
  }
}
