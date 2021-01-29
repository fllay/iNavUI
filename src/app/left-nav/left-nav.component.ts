import { Component, OnInit,AfterViewInit,OnDestroy } from '@angular/core';
//import { Router} from '@angular/router';
import { HttpClient} from '@angular/common/http';
//import {Subject} from 'rxjs';
declare function setWaypointBtnActivation():any;
declare var current_position:any;
//declare var flag:any;

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  joy:any;
  joy_check:any;
  setWaypointBtnActivation = setWaypointBtnActivation;
  robot_post = {
      pose:{
        pose:{
        position:{
        x:0,
        y:0,
        z:0
        },
        orientation:{
        x:0,
        y:0,
        z:0,
        w:0
        }
        }    
       }
     }



     check_val:any;
  public blockly:any;

  constructor(
    private http: HttpClient
   
  ) { 

  }


  setWays(){
    this.setWaypointBtnActivation();
  }

  restart(){
      let url = "http://"+localStorage.getItem("robot_ip")+":5000/restart";
        this.http.get<any>(url).subscribe(res=>{
          console.log("Get Map",res.message);
          alert(res);
      },err=>{
        console.log('Error: ' + err.error);
        console.log('Name: ' + err.name);
        console.log('Message: ' + err.message);
        console.log('Status: ' + err.status);
      }
      )
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
   this.check_val = setInterval(() => {
     try {
      let new_val = JSON.stringify(current_position);
      let json_parse = JSON.parse(new_val);
      if(json_parse.pose.pose.position.x != 0){
      this.robot_post =  json_parse;
      }
     } catch (error) {
       
     }
    //console.log(new_val);
   }, 200);
  }

 ngOnDestroy(){
   clearInterval(this.check_val);
 }

}
