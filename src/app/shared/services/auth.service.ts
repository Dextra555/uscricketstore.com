import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() isLogged: EventEmitter<any> = new EventEmitter();

  constructor(private http:HttpClient) { }

  public login(data):Observable<any>{
  	return this.http.post(`${environment.SERVER_URL}/auth/login`,data);
  }

  public signup(data):Observable<any>{
  	return this.http.post(`${environment.SERVER_URL}/auth/signup`,data);
  }

  public checkguest(data):Observable<any>{
  	return this.http.post(`${environment.SERVER_URL}/checkguest`,data);
  }

  public loginStatus(status): void  {
    if (status) {
        this.isLogged.emit(true);
    } else {
        this.isLogged.emit(false);
    }
}


}
