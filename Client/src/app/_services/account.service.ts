import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSoucrce = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSoucrce.asObservable();

  constructor(private http : HttpClient) { }
  
  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((res: User) =>{
        const user = res;
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }
  
  setCurrentUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSoucrce.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSoucrce.next(null);
  }
  register(model: any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(map((user: User) => {
      if(user){
        this.setCurrentUser(user);
      }
    }))
  }
}
