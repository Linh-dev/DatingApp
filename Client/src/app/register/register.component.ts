import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  registerForm: FormGroup;
  maxDate: Date;

  constructor(private accoutService: AccountService, private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) =>{
      return control?.value === control?.parent?.controls[matchTo].value
      ? null : {isMatching: true} 
    }
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username:['', Validators.required],
      password:['', [Validators.required, Validators.minLength(4)]],
      confirmPassword:['', [Validators.required, this.matchValues('password')]],
      gender:[''],
      knownAs:['', Validators.required],
      dateOfBirth:['', Validators.required],
      city:['', Validators.required],
      country:['', Validators.required],
    });
  }

  register(){
    this.accoutService.register(this.registerForm.value).subscribe(res =>{
      console.log(res);
      this.cancel();
    }, error =>{
        console.log(error);
        // this.toastr.error(error);
    })
    console.log(this.registerForm.value);
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
