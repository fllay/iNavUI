import { Component, OnInit } from '@angular/core';
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
  constructor(
  ) { }

  ngOnInit(): void {
    this.robot_ip = localStorage.getItem("robot_ip");
    this.robot_port = localStorage.getItem("robot_port");
    this._robot_ip = this.robot_ip;
  }

}
