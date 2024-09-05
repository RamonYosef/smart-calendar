import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private anoAtual = new Date().getFullYear()
  private urlApi = "https://brasilapi.com.br"

  constructor(private http: HttpClient) { }

  
  getDataFeriados(): Observable<any> {
    console.log(this.anoAtual)
    return this.http.get<any>(`${this.urlApi}/api/feriados/v1/${this.anoAtual}`)
  }
}
