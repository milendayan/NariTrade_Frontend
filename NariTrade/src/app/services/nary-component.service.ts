import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NaryComponentService {
  constructor(private http: HttpClient) {}
  apiUri = '/api/narycomponents';
  httpOptons = new HttpHeaders().set('Content-Type', 'application/json');

  getAllnaryData(): Observable<any> {
    return this.http.get<any>(this.apiUri);
  }
  newnary(data: any): Observable<any> {
    return this.http.post<any>(this.apiUri, data, { headers: this.httpOptons });
  }

}
