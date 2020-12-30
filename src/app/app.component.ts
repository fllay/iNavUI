import { Component,OnInit } from '@angular/core';
import { Router} from '@angular/router';
import{ip} from './services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inav-ui';
  robot_ip = ip;
  constructor(
    private router: Router
  ){

  }
  ngOnInit(){
   this.robot_ip =  String(localStorage.getItem("robot_ip"));
   console.log(this.robot_ip);
   if(localStorage.getItem('login') === 'True'){
     return;
   }else{
     this.router.navigateByUrl('login')}
  }
}
