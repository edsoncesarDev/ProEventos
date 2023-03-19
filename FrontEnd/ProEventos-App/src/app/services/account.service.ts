import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/Identity/User';
import { UserUpdate } from '../models/Identity/UserUpdate';

@Injectable()
export class AccountService {

  //a variável currentUserSource irá receber diversas atualizações
  //toda as vezes que o usuário mudar, o valor da variável também será alterado
  private currentUserSource = new ReplaySubject<User>(1);

  //todas as vezes que a variável currentUserSource for alterada
  //a variável currentUser$ também irá sofrer alteração
  public currentUser$ = this.currentUserSource.asObservable();

  public baseUrl: string = environment.apiURL + 'api/account/';

  constructor(private http: HttpClient) { }

  public login(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }

  public getUser(): Observable<UserUpdate> {
    return this.http
               .get<UserUpdate>(this.baseUrl + 'getUser')
               .pipe(take(1));
  }

  public updateUser(model: UserUpdate): Observable<void> {
    return this.http
               .put<UserUpdate>(this.baseUrl + 'updateUser', model)
               .pipe(
                  take(1),
                  map((user: UserUpdate) => {
                      this.setCurrentUser(user);
                    }
                  )
                )
  }


  public register(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'registerUser', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null as any);
    //this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  postUpload(file: File): Observable<UserUpdate>{
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
               .post<UserUpdate>(`${this.baseUrl}upload-image`, formData)
               .pipe(take(1));
  }
}
