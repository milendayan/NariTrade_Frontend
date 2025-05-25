import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
  

})
export class NaryComponentService {

  constructor(private http: HttpClient) { }
  apiUri = '/api/micomponente';
  httpOptons = new HttpHeaders().set('Content-Type', 'application/json');
}
