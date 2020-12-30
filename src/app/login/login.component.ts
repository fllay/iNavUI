import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 username="";
 password="";
  constructor(
    private router: Router
  ) { }

  submit_log(){
  if(this.username == "" || this.password === ""){
  return alert("Username or Password could not blank!!")
  }else{
    if(this.username === "admin" && this.password ==="admin2020"){
      localStorage.setItem('login','True');
      this.router.navigateByUrl("home");
    }else{
      localStorage.setItem('login','False');
      return;
    }
  }
  }

  ngOnInit(): void {
    localStorage.setItem('page','login' );
  }

}
