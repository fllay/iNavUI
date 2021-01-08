import { Component, OnInit,AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.css']
})
export class MapEditComponent implements OnInit {
  img_src:any;

  dwg:any;
  constructor(
    private http: HttpClient,
    private _FileSaverService: FileSaverService
  ) { }
 cancel(){

 }
 save(event:any){
  this._FileSaverService.save(event,"somefile.jpg");
 }

 get_img_src(){
  var jpegUrl = "http://192.168.1.197:5000/getEditMap"
  this.img_src = jpegUrl;
  console.log(this.img_src);
 }
  ngOnInit(): void {
  }

  ngAfterViewInit(){
    setTimeout(() =>{
      this.get_img_src();
    },1000 )
  }

}
