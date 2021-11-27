import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members : Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  constructor(private memberService: MembersService, private acountService: AccountService) {
    this.acountService.currentUser$.pipe(take(1)).subscribe(res =>{
      this.user = res;
      this.userParams = new UserParams(res);
    })
   }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMembers(this.userParams).subscribe(res =>{
      console.log(this.userParams);
      this.members = res.result;
      this.pagination = res.pagination;
      console.log(this.pagination);
    })
  }

  reserFilters(){
    this.userParams = new UserParams(this.user);
    this.loadMember();
  }

  pageChanged(event: any){
    this.userParams.pageNumber = event.page;
    this.loadMember();
  }
}
 