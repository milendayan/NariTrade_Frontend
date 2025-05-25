import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NaryComponentService {
  constructor(private http: HttpClient) {}
  apiUri = '/api/narycomponents';
  idnary: any;
  editablenary: boolean = false;
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
  updatenaryEntry() {
    //Removiendo valores vacios del formulario de actualización
    for (let key in this.naryForm.value) {
      if (this.naryForm.value[key] === '') {
        this.naryForm.removeControl(key);
      }
    }
    this.naryService
      .updateAnimal(this.idnary, this.naryForm.value)
      .subscribe(() => {
        //Enviando mensaje de confirmación
        this.newMessage('Animal editado');
      });
  }
}
