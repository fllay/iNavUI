import { Component, OnInit,AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import {Router} from '@angular/router';
import { ToastUiImageEditorComponent } from 'ngx-tui-image-editor';
//import panzoom from "panzoom";


@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.css']
})
export class MapEditComponent implements OnInit {
  img_src:any;
  img_file:any;
  //@ViewChild('scene', { static: false }) scene:any;
  //panZoomController:any;
  @ViewChild(ToastUiImageEditorComponent,{ static: false}) editorComponent: any;
  zoomLevels = [0,1,2,3,4,5,6,7,8,9,10];
  currentZoomLevel=1;
 
  constructor(
    private http: HttpClient,
    private _FileSaverService: FileSaverService,
   
  ) {
   //this.scene = ElementRef;
   this.editorComponent = ToastUiImageEditorComponent;
    }


 cancel(){

 }
 save(event:any){
  this._FileSaverService.save(event,"somefile.jpg");
 }

 get_img_src(){
  let url ="http://" + localStorage.getItem("robot_ip") + ":5000/getEditMap";
  var jpegUrl =url;
  this.img_src = jpegUrl;
  console.log(this.img_src);
 }


  ngOnInit(): void {
  }


  ngAfterViewInit(){
    //this.panZoomController = panzoom(this.scene.nativeElement);
  }
}
