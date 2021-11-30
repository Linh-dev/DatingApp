import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeader } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;
  
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      console.log(user);
      this.user = user;
      this.userParams = new UserParams(user);
    })
   }

   getUserParams(){
    return this.userParams;
   }

   setUserParams(userParams: UserParams){
    this.userParams = userParams;
   }

   resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
   }


  getMembers(userParams: UserParams){
    var res = this.memberCache.get(Object.values(userParams).join('-'));
    if(res){
      return of(res);
    }

    let params = getPaginationHeader(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(map(res =>{
      this.memberCache.set(Object.values(userParams).join('-'), res);
      return res;
    }))

  }

  getMember(username: string){
    // console.log(this.memberCache);
    const members = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result), []);
    const member = members.find((member: Member) => member.userName == username);
    console.log(members);
    console.log(member);
    console.log(username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      }));
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId,{});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/' + photoId);
  }
}
