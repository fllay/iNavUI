import { Component,OnInit } from '@angular/core';
import { Router} from '@angular/router';
import{ip} from './services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'inav-ui';
  robot_ip = ip;
  mainSidebar:any;
  constructor(
    private router: Router
  ){

  }
  ngOnInit(){
  try {
    this.robot_ip =  String(localStorage.getItem("robot_ip"));
    console.log(this.robot_ip);
    if(localStorage.getItem('login') === 'True'){
     this.router.navigateByUrl('map3-d');
     this.mainSidebar.classList.add("show");
    }else{
     this.mainSidebar = document.getElementById("sidebar");
     this.mainSidebar.classList.add("hide");
     this.router.navigateByUrl('login')
    }
  } catch (error) {
    return;
  }
  }
  
}
