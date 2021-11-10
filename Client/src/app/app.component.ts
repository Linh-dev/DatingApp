import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Linh Dep Trai';
  constructor(private http: HttpClient){}
  users: any;

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/users/1').subscribe(res =>{
      this.users = res;
      console.log(this.users);
      console.log('test');
    }, error =>{
      console.log(error);
    });
  }
}
