import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor(private accoutService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register(){
    this.accoutService.register(this.model).subscribe(res =>{
      console.log(res);
      this.cancel();
    }, error =>{
      if(this.model.username === '' || this.model.username.indexOf(' ') != -1){
        this.toastr.warning("Username is required and not consists white-space");
      }else if(this.model.password === '' || this.model.password.indexOf(' ') != -1){
        this.toastr.warning("Password is required and not consists white-space");
      }else{
        console.log(error);
        this.toastr.error(error.error);
      }
    })

  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
