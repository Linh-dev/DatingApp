import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSoucrce = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSoucrce.asObservable();

  constructor(private http : HttpClient, private presenceService: PresenceService) { }
  
  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((res: User) =>{
        const user = res;
        if(user){
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
      })
    )
  }
  
  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDeCodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSoucrce.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSoucrce.next(null);
    this.presenceService.stopHubConnection();
  }
  register(model: any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(map((user: User) => {
      if(user){
        this.setCurrentUser(user);
        this.presenceService.createHubConnection(user);
      }
    }))
  }

  getDeCodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
