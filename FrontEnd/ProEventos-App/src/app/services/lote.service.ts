import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lote } from '../models/Lote';

@Injectable(
  //providedIn: 'root' adicionando no app.module.ts
)
export class LoteService {

  public baseURL: string = environment.apiURL + 'api/lotes';

  constructor(private http: HttpClient) { }

  public getLotesByEventoId(eventoId: number, loteId: number): Observable<Lote[]> {
    return this.http
      .get<Lote[]>(`${this.baseURL}/${eventoId}/${loteId}`)
      .pipe(take(1));
  }

  public saveLotes(eventoId: number, lotes: Lote[]): Observable<Lote[]>{
    return this.http
      .put<Lote[]>(`${this.baseURL}/${eventoId}`, lotes)
      .pipe(take(1));
  }

  public deleteLote(eventoId: number, loteId: number): Observable<any>{
    return this.http
      .delete<any>(`${this.baseURL}/${eventoId}/${loteId}`)
      .pipe(take(1));
  }
}
