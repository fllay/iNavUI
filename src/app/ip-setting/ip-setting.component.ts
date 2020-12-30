import { Component, OnInit } from '@angular/core';
import {ip,port} from '../services'
import { Router} from '@angular/router';
@Component({
  selector: 'app-ip-setting',
  templateUrl: './ip-setting.component.html',
  styleUrls: ['./ip-setting.component.css']
})
export class IpSettingComponent implements OnInit {
  robot_ip = ip;
  robot_port = port;
  constructor(
    private router: Router
  ) { }

  save_robot_ip(){
  localStorage.setItem('robot_ip',this.robot_ip);
  localStorage.setItem('robot_port',this.robot_port);
  alert("Successfully save")
  this.router.navigateByUrl("home");
  }
  ngOnInit(): void {
    localStorage.setItem('page','ip-setting');
  }

}
