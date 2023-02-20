import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Evento } from '../models/Evento';
import { PaginatedResult } from '../models/Pagination';

@Injectable(
  //{ providedIn: 'root' } //adicionado no app.module.ts
)
export class EventoService {

  public baseURL: string =  environment.apiURL + 'api/Eventos';

  constructor(private http: HttpClient) { }

  public getEventos(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Evento[]>> {

    const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();

    let params = new HttpParams;

    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if(term != null && term != ''){
      params = params.append('term', term);
    }

    return this.http
      .get<Evento[]>(this.baseURL, {observe: 'response', params})
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body;
          if(response.headers.has('Pagination')){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
          }

          return paginatedResult;

        })
      );
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http
      .get<Evento>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http
      .post<Evento>(this.baseURL, evento)
      .pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http
      .put<Evento>(`${this.baseURL}/${evento.id}`, evento)
      .pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http
      .delete<any>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public postUpload(eventoId: number, file: File): Observable<Evento>{

    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
      .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
      .pipe(take(1));
  }
}
