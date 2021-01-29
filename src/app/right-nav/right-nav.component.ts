import { Component, OnInit,AfterViewInit,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {edit_img_src} from '../services';
import { Router} from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';

declare var _check_nav:any;
declare function loadMap():any;
declare function init_blockly():any;
declare function createJoystick():any;

declare var lin_speed:any;//0.01 default
declare var ang_speed:any;//0.005 default

@Component({
  selector: 'app-right-nav',
  templateUrl: './right-nav.component.html',
  styleUrls: ['./right-nav.component.css']
})
export class RightNavComponent implements OnInit,AfterViewInit {

  createjoy = createJoystick;
   load= loadMap;
   blockly= init_blockly;
   map_name =[{name:""}];
   selected:any;
   edit_src= edit_img_src;
   selected_map:any;
   selected_mapid:any;
   map_selected:any;
   nav_check = "false";
   switch_nav:any;
   elmnt:any;
   linear = 20;
   angle = 10;
  constructor(
    private http: HttpClient,
    private router: Router,
    private _FileSaverService: FileSaverService,
  ) { }

  load_map(){
    this.load();
    this.get_mapname();
    this.sCroll();
    console.log("scroll height");
  }

  load_blockly(){
    this.blockly();
    this.load_map();
  }

   navigated(event:any){
   console.log(event);
   }
  load_maps(){
  let url = "http://"+localStorage.getItem("robot_ip")+":5000/loadMap";
  this.http.post<any>(url, "test").subscribe(res=>{
  console.log("Load Map"+ URL,res.file);
  this.map_name = res.files;
  this.sCroll();
    })
  }

  toDataURL(url:any, callback:any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.send();
    }

    dataURItoBlob(dataURI:any) {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
    for (var i = 0; i < binary.length; i++) {
       array.push(binary.charCodeAt(i));
    }
   return new Blob([new Uint8Array(array)], {
      type: 'image/jpg'
  });
  }
  
  get_edit_map(str:any){
    let url = "http://"+localStorage.getItem("robot_ip")+":5000/selectMap";
      this.http.post<any>(url, str).subscribe(res=>{
        alert("Get map:" + res);
        setTimeout(() => {
          let url ="http://" + localStorage.getItem("robot_ip") + ":5000/getEditMap";
          this.toDataURL(url,(dataUrl:any)=> {
          let myFile:Blob=this.dataURItoBlob(dataUrl);
          this._FileSaverService.save(myFile,"map.jpg");
          });
        },100)
    },err=>{
       console.log('Error: ' + err.error);
       console.log('Name: ' + err.name);
       console.log('Message: ' + err.message);
       console.log('Status: ' + err.status);
    })
   }

   adjust_linear(){
   lin_speed = (this.linear)/8000;
   console.log("Linear speed : ",lin_speed);
   localStorage.setItem('linear',String(this.linear));
   }

   adjust_angle(){
   ang_speed = (this.angle)/8000;
   console.log("Angle speed : ",ang_speed)
   localStorage.setItem('angle',String(this.angle));
   }

   createJoy(){
     setTimeout(() => {
      this.createjoy();
     }, 500);
   }

    init_nav(event:any){
      setTimeout(() => {
        this.nav_check = _check_nav;
      }, 200);
    }

  ngOnInit(): void {
 
  }

  set_check(event:any){
   console.log("map id",event)
  }

  get_mapname(){
  setTimeout(() => {
    this.map_selected = localStorage.getItem("mapname");
    console.log("mapname",this.map_selected);
  }, 500);
  }

  sCroll() {
    this.elmnt = document.getElementById("scroll");
   this.elmnt.scrollTop = 0;
   console.log("Scroll height");
  }

  ngAfterViewInit(){
  this.get_mapname();
  setTimeout(() => {
    let nav_val  = localStorage.getItem("nav");
    this.nav_check = String(nav_val)
    this.switch_nav = document.getElementById("switch_nav")
    if (this.nav_check == "true"){
      this.switch_nav.checked = true;
    }else{
      this.switch_nav.checked = false;
    }
    console.log("get_nav",this.nav_check);
    this.sCroll();
  }, 200);

  let loc_linear:any = localStorage.getItem('linear');
  let loc_angle:any = localStorage.getItem('angle');
  this.linear =  parseInt(loc_linear);
  this.angle = parseInt(loc_angle);

  }
}
