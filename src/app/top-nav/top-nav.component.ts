import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {port,ip} from '../services';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  robot_ip:any;
  robot_port:any;
  public _robot_ip=ip;
  public _robot_port = port;
  mainSidebar:any;
  constructor(
    private router: Router
  ) { }

  save_IP(){
  localStorage.setItem("robot_ip",this.robot_ip);
  this.robot_ip = localStorage.getItem("robot_ip");
  }

  save_Port(){
    localStorage.setItem("robot_port",this.robot_port);
    this.robot_ip = localStorage.getItem("robot_port"); 
  }

  reconnect(){
   window.location.replace('/');
  }
  ngOnInit(): void {
    this.robot_ip = localStorage.getItem("robot_ip");
    this.robot_port = localStorage.getItem("robot_port");
    this._robot_ip = this.robot_ip;
  }

}
