import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare function createJoystick():any;
declare function loadMap():any;
declare function init_blockly():any;
declare function init_blockly():any; 
@Component({
  selector: 'app-right-nav',
  templateUrl: './right-nav.component.html',
  styleUrls: ['./right-nav.component.css']
})
export class RightNavComponent implements OnInit {
  create_joy=createJoystick;
   load= loadMap;
   blockly= init_blockly;
   map_name =[{name:""}];
   selected:any;
  constructor(
    private http: HttpClient
  ) { }

  createjoy(){
    this.create_joy();
    console.log("create joy");
  }
  load_map(){
    this.load();
  }

  load_blockly(){
    this.blockly();
  }

  load_maps(){
  this.http.post<any>('http://192.168.1.197:5000/loadMap', "test").subscribe(res=>{
  console.log(res.file);
  this.map_name = res.files;
    })
  }

  get_edit_map(str:any){
      this.http.post<any>('http://192.168.1.197:5000/selectMap', str).subscribe(res=>{
        console.log(res.message);
        alert(res);
    },err=>{
      console.log('Error: ' + err.error);
      console.log('Name: ' + err.name);
      console.log('Message: ' + err.message);
      console.log('Status: ' + err.status);
    }
    )
   }

  onNgModelChange(event:any){

  }
  ngOnInit(): void {
  this.create_joy();
  this.load_maps();
  }

}
