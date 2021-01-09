import { Component, OnInit,AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.css']
})
export class MapEditComponent implements OnInit {
  img_src:any;
  img_file:any;

  constructor(
    private http: HttpClient,
    private _FileSaverService: FileSaverService,
    private sanitizer: DomSanitizer
  ) { }
 cancel(){

 }
 save(event:any){
  this._FileSaverService.save(event,"somefile.jpg");
 }

 get_img_src(){
  var jpegUrl = "http://192.168.1.44:5000/getEditMap"
  this.img_src = jpegUrl;
  console.log(this.img_src);
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
  xhr.send();
}

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    setTimeout(() =>{
     // this.get_img_src();
    this.toDataURL('http://192.168.1.44:5000/getEditMap',(dataUrl:any)=> {
      console.log(dataUrl);
      this.img_file = dataUrl;
      })
    },1000 )
  }

}
