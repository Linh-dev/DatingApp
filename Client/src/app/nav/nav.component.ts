import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model : any = {};

  constructor(public accountService : AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  login(){
    this.accountService.login(this.model).subscribe(res  => {
      this.router.navigateByUrl('/members');
    }, error =>{
      if(this.model.username === '' || this.model.username.indexOf(' ') != -1){
        this.toastr.warning("Username is required and not consists white-space");
      }else if(this.model.password === '' || this.model.password.indexOf(' ') != -1){
        this.toastr.warning("Password is required and not consists white-space");
      }else{
        console.log(error);
        this.toastr.error(error.error);
      }
    });
  }
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
